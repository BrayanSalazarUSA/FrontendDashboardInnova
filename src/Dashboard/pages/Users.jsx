import { Dialog } from "primereact/dialog";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Checkbox } from "primereact/checkbox";
import { Password } from "primereact/password";
import { Divider } from "primereact/divider";
import { Button } from "primereact/button";
import { AiOutlinePlusCircle } from "react-icons/ai";
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Resize,
  Sort,
  ContextMenu,
  Filter,
  Page,
  Search,
  PdfExport,
  Inject,
} from "@syncfusion/ej2-react-grids";

import { contextMenuItems, ordersGrid, userGrid } from "../data/dummy";
import { Header } from "../components";
import { getUsers } from "../helper/getUsers";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { UserContext } from "../../context/UserContext";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useFetchRoles } from "../Hooks/useFetchRoles";
import { getRoles } from "../helper/getRoles";
import { GetPropertyInfo } from "../helper/getPropertyInfo";
import { getPropertiesInfo } from "../helper/getProperties";
import { postNewUser } from "../helper/postNewUser";
import Swal from "sweetalert2";
import "../pages/css/Outlet/Outlet.css";
import "./css/users/Users.css";
import TableSkeleton from "../components/TableSkeleton";
import TypewriterText from "../components/Texts/TypewriterTex";

export const Users = () => {
  const { userProvider, setUserProvider, flag } = useContext(UserContext);

  const [userDialog, setUserDialog] = useState(false);
  const [t, i18n] = useTranslation("global");
  const [isManager, setIsManager] = useState(false);
  const { navigate } = useNavigate();

  const toolbarOptions = ["Search"];
  const [users, setUsers] = useState([]);
  const [userSaved, setUserSaved] = useState(false);
  const [roles, setRoles] = useState([]);
  const [properties, setProperties] = useState();
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(0);

  const options = [
    { key: "Reports at all levels", code: 2 },
    { key: "Levels 3 and 4 only", code: 1 },
  ];

  const { userContext } = useContext(UserContext);


  // Primero intentamos obtener el roleName desde el localStorage
  let user = JSON.parse(localStorage.getItem("user") || "{}");
  let userRole = user?.role?.rolName;

  // Si no se encuentra en el localStorage, lo buscamos en el userContext
  if (!userRole && userContext && userContext.role) {
    console.log("No se ecnotró el role, configurando role del contexto");
    userRole = userContext.role.rolName;
  }

  // Si el roleName no se encuentra, redirigimos al login
  if (!userRole) {
    alert("Role is not defined, redirecting to login.");
    navigate("/login");
  }

  
  useEffect(() => {
    getUsers().then((data) => setUsers(data));
    getPropertiesInfo(navigate).then((data) => {
      propertiesSelectedVar = data.map((i) => {
        return { id: i.id, name: i.name, direction: i.direction, img: i.img };
      });
      setProperties(propertiesSelectedVar);
    });
  }, [userSaved, flag]);

  let propertiesSelectedVar = [];

 
  useEffect(() => {
    const fetchData = async () => {
      const userData = await getUsers();
      const propertiesData = await getPropertiesInfo(navigate);
      setUsers(userData);
      setProperties(
        propertiesData.map((prop) => ({
          id: prop.id,
          name: prop.name,
          direction: prop.direction,
          img: prop.img,
        }))
      );
      setLoading(false);
    };
    fetchData();
  }, [navigate, flag]);

  useEffect(() => {
    const fetchRoles = async () => {
      const rolesData = await getRoles();
      if (rolesData && rolesData.length > 0) {
        const rolesArray = rolesData.map(({ id, rolName }) => ({
          rolKey: id,
          rolName: t(
            `dashboard.users.dialog-add-user.roles.roles-dropdown.${rolName}`
          ),
          originalName: rolName,
        }));
        setRoles(rolesArray);
      } else {
        console.log("No roles data found");
      }
    };
    fetchRoles();
  }, [t]);

  const header = (
    <div className="font-bold mb-3">
      {t("dashboard.users.dialog-add-user.suggestion.pick-password")}
    </div>
  );

  const footer = (
    <>
      <Divider />
      <p className="mt-2">
        {t("dashboard.users.dialog-add-user.suggestion.suggestions")}
      </p>
      <ul className="pl-2 ml-2 mt-0 line-height-3">
        <li>
          {t(
            "dashboard.users.dialog-add-user.suggestion.at-least-one-lowercase"
          )}
        </li>
        <li>
          {t(
            "dashboard.users.dialog-add-user.suggestion.at-least-one-uppercase"
          )}
        </li>
        <li>
          {t("dashboard.users.dialog-add-user.suggestion.at-least-one-numeric")}
        </li>
        <li>
          {t("dashboard.users.dialog-add-user.suggestion.minimum-characters")}
        </li>
      </ul>
    </>
  );

  const handleInputChange = (field, value) => {
    setUserProvider((prevState) => ({
      ...prevState,
      [field]: value,
    }));

    if (validationErrors[field] && value.trim()) {
      setValidationErrors((prevState) => ({
        ...prevState,
        [field]: null,
      }));
    }
  };

  const validateUserDetails = () => {
    const errors = {};
    if (!userProvider.name || userProvider.name.trim() === "") {
      errors.name = t(
        "dashboard.users.dialog-add-user.validation.name-required"
      );
    }
    if (!userProvider.email || userProvider.email.trim() === "") {
      errors.email = t(
        "dashboard.users.dialog-add-user.validation.email-required"
      );
    }
    if (!userProvider.password || userProvider.password.trim() === "") {
      errors.password = t(
        "dashboard.users.dialog-add-user.validation.password-required"
      );
    }
    if (!userProvider.rol) {
      errors.rol = t(
        "dashboard.users.dialog-add-user.validation.role-required"
      );
    }

    if (!userProvider.image || userProvider.image.size === 0) {
      errors.image = t(
        "dashboard.users.dialog-add-user.validation.image-required"
      );
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleClose = () => {
    setUserDialog(false);
    setUserProvider({});
    setValidationErrors({});
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUserProvider((prevState) => ({
        ...prevState,
        image: file,
      }));

      if (validationErrors.image) {
        setValidationErrors((prevState) => ({
          ...prevState,
          image: null,
        }));
      }
    }
  };

  const saveNewUser = async () => {
    if (!validateUserDetails()) {
      return;
    }

    const formData = new FormData();
    const userBlob = new Blob(
      [
        JSON.stringify({
          name: userProvider.name,
          email: userProvider.email,
          password: userProvider.password,
          isManager:userProvider.manager,
          categoryEmail: userProvider.categoryEmail,
          rol: {
            id: userProvider.rol.rolKey,
            rolName: userProvider.rol.originalName,
          },
          properties: userProvider.properties || [],
        }),
      ],
      { type: "application/json" }
    );

    console.log({
      name: userProvider.name,
      email: userProvider.email,
      password: userProvider.password,
      isManager:userProvider.manager,
      categoryEmail: userProvider.categoryEmail,
      rol: {
        id: userProvider.rol.rolKey,
        rolName: userProvider.rol.originalName,
      },
      properties: userProvider.properties || [],
    })
    formData.append("user", userBlob);

    if (userProvider.image) {
      formData.append("img", userProvider.image);
    }
    try {
      setLoading(true);

      const data = await postNewUser(formData, t);
      if (data) {
        setUserSaved(!userSaved);
        setUserDialog(false);
        setUserProvider({});
        setLoading(false);
      } 
     console.log(userBlob);
     console.log(userProvider);
     
    } catch (error) {}
  };

  

  return (
    <>
      <Dialog
        header={t("dashboard.users.dialog-add-user.add-user")}
        visible={userDialog}
        onHide={handleClose}
        modal
        dismissableMask
        style={{ width: "40vw", display: "flex", justifyContent: "center" }}
        footer={
          <div className="w-full flex justify-center">
            <Button
              icon="pi pi-times"
              severity="danger"
              label={t("dashboard.users.dialog-add-user.cancel")}
              onClick={handleClose}
            />
            <div className="w-3"></div>
            <Button
              icon="pi pi-check"
              label={t("dashboard.users.dialog-add-user.send")}
              className="w-full"
              onClick={() => {
                saveNewUser();
              }}
            />
          </div>
        }
      >
        <div className="w-full flex flex-col mx-auto">
          <div className="mt-6 mb-6 mx-auto w-8/12">
            <span className="p-float-label w-full">
              <InputText
                id="username"
                value={userProvider.name}
                className="w-full"
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
              <label htmlFor="username">
                {t("dashboard.users.dialog-add-user.name")}
              </label>
              {validationErrors.name && (
                <small className="p-error">{validationErrors.name}</small>
              )}
            </span>
          </div>

          <div className="mb-6 mx-auto w-8/12">
            <span className="p-float-label w-full">
              <InputText
                id="email"
                value={userProvider.email}
                className="w-full"
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
              <label htmlFor="email">
                {t("dashboard.users.dialog-add-user.email")}
              </label>
              {validationErrors.email && (
                <small className="p-error">{validationErrors.email}</small>
              )}
            </span>
          </div>

          <div className="mb-6 mx-auto w-8/12">
            <span className="p-float-label w-full">
              <Password
                id="password"
                toggleMask
                value={userProvider.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="w-full"
                header={header}
                footer={footer}
              />
              <label htmlFor="password">
                {t("dashboard.users.dialog-add-user.password")}
              </label>
              {validationErrors.password && (
                <small className="p-error">{validationErrors.password}</small>
              )}
            </span>
          </div>

          <div className="mb-6 mx-auto w-8/12">
            <label htmlFor="image">
              {t("dashboard.users.dialog-add-user.search-img")}
            </label>
            <div className="file-upload-container">
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                className="file-input"
                style={{ display: "none" }}
              />
              <label htmlFor="image" className="file-input-label">
                {t("dashboard.users.dialog-add-user.search-img")}
              </label>
              <span id="file-name" className="file-name">
                {userProvider.image ? userProvider.image.name : ""}
              </span>
              {validationErrors.image && (
                <small className="p-error">{validationErrors.image}</small>
              )}
            </div>
          </div>

          <div className="mx-auto w-8/12 ">
            <Dropdown
              value={userProvider.rol}
              onChange={(e) => {
                console.log("Nuevo valor de rol seleccionado:", e.value);
                setUserProvider((prev) => ({
                  ...prev,
                  rol: {
                    rolKey: e.value.rolKey,
                    rolName: e.value.rolName,
                    originalName: e.value.originalName,
                  },
                }));
                if (validationErrors.rol) {
                  setValidationErrors((prev) => {
                    const updatedErrors = { ...prev };
                    delete updatedErrors.rol;
                    return updatedErrors;
                  });
                }
              }}
              optionLabel="rolName"
              options={roles}
              placeholder={t(
                "dashboard.users.dialog-add-user.roles.select-rol"
              )}
              className="w-full"
            />
            {validationErrors.rol && (
              <small className="p-error">{validationErrors.rol}</small>
            )}
          </div>

          {userProvider?.rol?.rolName == "Client" && (
            <div className="mx-auto w-8/12 mt-6">
              <p className="mx-auto mb-0 pl-2 p-0 w-full text-[#4F46E5]">
                Client Details
              </p>
              <div className="w-full py-2 mt-1 mb-6  rounded-md">
                <span className="p-float-label mb-5 ml-2 w-full">
                  <Checkbox
                    onChange={(e) =>{
                      const newValue = e.checked ? 1 : 0; // Asigna 1 si está marcado, 0 si no está marcado

                      setUserProvider((prev) => ({
                        ...prev,
                        manager: newValue,
                      }))}
                    }
                    onClick={(e)=> {console.log(e.value); console.log("Hola")}}
                    className="mr-2"
                    checked={userProvider.manager === 1}
                    inputId="mananger"
                  ></Checkbox>
                  <label htmlFor="mananger" className="ml-4">
                    Manager/Primary Email Recipient
                  </label>
                  {/*   <span>{value || 0}</span> */}
                  {validationErrors.email && (
                    <small className="p-error">{validationErrors.email}</small>
                  )}
                </span>
                <Dropdown
                  value={userProvider.categoryEmail}
                  onChange={(e) => {
                    console.log("Nuevo valor de category:", e.value);
                    setUserProvider((prev) => ({
                      ...prev,
                      categoryEmail: e.value,
                    }));
                  }}
                  optionLabel="key"
                  optionValue="code"
                  options={options}
                  placeholder="Send Reports Via Email"
                  className="w-full"
                />
                {validationErrors.rol && (
                  <small className="p-error">{validationErrors.rol}</small>
                )}
              </div>
            </div>
          )}
        </div>
      </Dialog>

      <div className="mx-7 bg-white rounded-3xl overflow-auto">
        <div className="background">
          <Header
            title={<TypewriterText text={t("dashboard.users.users-tittle")} />}
          />
          <div className="card flex justify-start ">
            {userRole == "Admin" ? (
              <button
                onClick={() => {
                  setUserDialog(true);
                  setUserProvider({});
                }}
                class="button"
              >
                {t("dashboard.users.add-user")}
                <AiOutlinePlusCircle />
              </button>
            ) : (
              <></>
            )}
          </div>
        </div>

        {loading ? (
          <TableSkeleton />
        ) : (
          <GridComponent
            id="userGrid"
            key={i18n.language}
            dataSource={users}
            allowPaging
            allowSorting
            allowExcelExport
            allowPdfExport
            toolbar={["Search"]}
          >
            <ColumnsDirective>
              {userGrid(t).map((column, index) => (
                <ColumnDirective key={index} {...column} />
              ))}
            </ColumnsDirective>
            <Inject
              services={[
                Resize,
                Sort,
                ContextMenu,
                Filter,
                Page,
                PdfExport,
                Search,
              ]}
            />
          </GridComponent>
        )}
      </div>
    </>
  );
};
