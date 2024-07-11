import { Dialog } from "primereact/dialog";
import React, { useContext, useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { Divider } from "primereact/divider";

import { AiOutlinePlusCircle } from "react-icons/ai";
import { GridComponent, ColumnsDirective, ColumnDirective, Resize, Sort, ContextMenu, Filter, Page, Search, Inject, } from "@syncfusion/ej2-react-grids";
import { contextMenuItems, orderAgents, orderAgentsAdmin } from "../data/dummy";
import { Header } from "../components";
import { useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { UserContext } from "../../context/UserContext";
import { getAgents } from "../helper/getAgents";
import { useTranslation } from "react-i18next";
import { postNewUser } from "../helper/postNewUser";
import { getRoles } from "../helper/getRoles";
import Swal from 'sweetalert2';
import { getPropertiesInfo } from "../helper/getProperties";
import TableSkeleton from "../components/TableSkeleton";
import TypewriterText from "../components/Texts/TypewriterTex";
import '../pages/css/Outlet/Outlet.css'


export const Agents = () => {

  const toolbarOptions = ["Search"];
  const { navigate } = useNavigate();
  const [t, i18n] = useTranslation("global");
  const [userDialog, setUserDialog] = useState(false);
  const [agentData, setAgentData] = useState([]);
  const [visible, setVisible] = useState(false);
  let user = JSON.parse(localStorage.getItem("user"));
  let userRole = user.role.rolName;
  const { userProvider, setUserProvider, agentDialog, setAgentDialog, flag, setFlag } = useContext(UserContext);
  const [userSaved, setUserSaved] = useState(false);
  const [roles, setRoles] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(true);


  const fetchMonitors = async () => {
    const agents = await getAgents(navigate);
    setAgentData(agents);
    setLoading(false)
  };

  useEffect(() => {
    setLoading(true)
    fetchMonitors();
    setLoading(false)
  }, [navigate, flag]);

  useEffect(() => {
    const fetchRoles = async () => {
      const rolesData = await getRoles();
      if (rolesData && rolesData.length > 0) {
        const rolesArray = rolesData.map(({ id, rolName }) => ({
          rolKey: id,
          rolName: t(`dashboard.agents.dialog-add-agent.roles.roles-dropdown.${rolName}`),
          originalName: rolName
        }));

        setRoles(rolesArray);
        const monitorRole = rolesArray.find(role => role.originalName === "Monitor");
        console.log("monitor Role data:", monitorRole)
        if (monitorRole) {
          setUserProvider(prev => ({
            ...prev,
            rol: {
              rolKey: monitorRole.rolKey,
              rolName: monitorRole.rolName,
              originalName: monitorRole.originalName
            }
          }));
        }
      } else {
        console.log('No roles data found');
      }
    };
    fetchRoles();
  }, [t, setUserProvider]);



  const header = <div className="font-bold mb-3">{t("dashboard.agents.dialog-add-agent.suggestion.pick-password")}</div>;
  const footer = (
    <>
      <Divider />
      <p className="mt-2">{t("dashboard.agents.dialog-add-agent.suggestion.suggestions")}</p>
      <ul className="pl-2 ml-2 mt-0 line-height-3">
        <li>{t("dashboard.agents.dialog-add-agent.suggestion.at-least-one-lowercase")}</li>
        <li>{t("dashboard.agents.dialog-add-agent.suggestion.at-least-one-uppercase")}</li>
        <li>{t("dashboard.agents.dialog-add-agent.suggestion.at-least-one-numeric")}</li>
        <li>{t("dashboard.agents.dialog-add-agent.suggestion.minimum-characters")}</li>
      </ul>
    </>
  );

  const handleInputChange = (field, value) => {
    setUserProvider(prev => ({
      ...prev,
      [field]: value
    }));
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateAgentDetails = () => {
    const errors = {};
    if (!userProvider.name || userProvider.name.trim() === "") {
      errors.name = t("dashboard.users.dialog-add-user.validation.name-required");
    }
    if (!userProvider.email || userProvider.email.trim() === "") {
      errors.email = t("dashboard.users.dialog-add-user.validation.email-required");
    }
    if (!userProvider.password || userProvider.password.trim() === "") {
      errors.password = t("dashboard.users.dialog-add-user.validation.password-required");
    }

    if (!userProvider.image || userProvider.image.trim() === "") {
      errors.image = t("dashboard.users.dialog-add-user.validation.image-required")
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };


  const saveNewUser = async () => {

    if (!validateAgentDetails()) return;

    const userToSend = {
      name: userProvider.name,
      email: userProvider.email,
      password: userProvider.password,
      image: userProvider.image,
      rol: {
        id: userProvider.rol.rolKey,
        rolName: userProvider.rol.originalName
      },
      properties: userProvider.properties || []
    };

    try {
      const data = await postNewUser(userToSend);
      if (data && !data.error) {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: t('dashboard.users.dialog-add-user.successful-response'),
          showConfirmButton: false,
          timer: 3000
        });
        setUserSaved(userSaved => !userSaved);
        setUserDialog(false);
        setUserProvider({});
        fetchMonitors();
      } else {
        throw new Error(data.message || 'Failed to create agent');
      }
    } catch (error) {
      console.error("Error al enviar datos:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.toString(),
      });
    }
  };


  const handleClose = () => {
    setUserDialog(false);
    setUserProvider({});
    setValidationErrors({});
  };

  return (


    <>
      <Dialog
        header={t("dashboard.agents.dialog-add-agent.add-agent")}
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
              label={t("dashboard.agents.dialog-add-agent.cancel")}
              onClick={handleClose}
            />
            <div className="w-3"></div>
            <Button
              icon="pi pi-check"
              label={t("dashboard.agents.dialog-add-agent.send")}
              className="w-full"
              onClick={() => {
                saveNewUser();
              }}
            />
          </div>
        }
      >
        <div className="w-full flex flex-col mx-auto">
          <div className="mt-6 mb-6 mx-auto w-7/12">
            <span className="p-float-label w-full">
              <InputText
                id="username"
                value={userProvider.name}
                className="w-full"
                onChange={(e) => {
                  setUserProvider((prev) => ({
                    ...prev,
                    name: e.target.value
                  }));
                  if (validationErrors.name) {
                    setValidationErrors((prev) => ({
                      ...prev,
                      name: null
                    }));
                  }
                }}
              />
              <label htmlFor="username">{t("dashboard.agents.dialog-add-agent.name")}</label>
              {validationErrors.name && <small className="p-error">{validationErrors.name}</small>}
            </span>
          </div>

          <div className=" mb-6 mx-auto w-7/12">
            <span className="p-float-label">
              <InputText
                id="username"
                value={userProvider.email}
                className="w-full"
                onChange={(e) => {
                  setUserProvider((prev) => ({
                    ...prev,
                    email: e.target.value
                  }));
                  if (validationErrors.email) {
                    setValidationErrors((prev) => ({
                      ...prev,
                      email: null
                    }));
                  }
                }}
              />
              <label htmlFor="username">{t("dashboard.agents.dialog-add-agent.email")}</label>
              {validationErrors.email && <small className="p-error">{validationErrors.email}</small>}
            </span>
          </div>

          <div className=" mb-6 mx-auto w-7/12 flex justify-center">
            <span className="p-float-label w-full">
              <Password
                toggleMask
                value={userProvider.password}
                onChange={(e) => {
                  setUserProvider((prev) => ({
                    ...prev,
                    password: e.target.value
                  }));
                  if (validationErrors.password) {
                    setValidationErrors((prev) => ({
                      ...prev,
                      password: null
                    }));
                  }
                }}
                className="w-full"
                header={header}
                footer={footer}
                promptLabel={t("dashboard.agents.dialog-add-agent.suggestion.enter-password")}
                weakLabel={t("dashboard.agents.dialog-add-agent.suggestion.password-strength.weak")}
                mediumLabel={t("dashboard.agents.dialog-add-agent.suggestion.password-strength.medium")}
                strongLabel={t("dashboard.agents.dialog-add-agent.suggestion.password-strength.strong")}
              />
              <label htmlFor="Password">{t("dashboard.agents.dialog-add-agent.password")}</label>
              {validationErrors.email && <small className="p-error">{validationErrors.email}</small>}
            </span>
          </div>

          <div className="mb-6 mx-auto w-7/12 flex justify-center">
            <span className="p-float-label w-full">
              <InputText
                id="image"
                value={userProvider.image}
                className="w-full"
                onChange={(e) => {
                  setUserProvider((prev) => ({
                    ...prev,
                    image: e.target.value
                  }));
                  if (validationErrors.image) {
                    setValidationErrors((prev) => ({
                      ...prev,
                      image: null
                    }));
                  }
                }}
              />
              <label htmlFor="image">{t("dashboard.agents.dialog-add-agent.image-url")}</label>
              {validationErrors.image && <small className="p-error">{validationErrors.image}</small>}
            </span>
          </div>


          <div className="mb-6 mx-auto w-7/12 flex justify-center">
            <div className="p-inputgroup">
              <span className="p-inputgroup-addon">
                <i className="pi pi-user"></i>
              </span>
              <div className="w-full p-inputtext p-component">
                <span>{t("dashboard.agents.dialog-add-agent.roles.roles-dropdown.Monitor")}</span>
              </div>
            </div>
          </div>

        </div>
      </Dialog>
      <div className="mx-7 bg-white rounded-3xl overflow-auto">
        <div className="background">
          <Header title={<TypewriterText text={t("dashboard.agents.agents-tittle")} />} />
          <div className="card flex justify-start ">
            {userRole == "Admin" ? (
              <button
                onClick={() => setUserDialog(prev => !prev)}
                class="button"
              >
                {t("dashboard.agents.add-agent")}
                <AiOutlinePlusCircle />

              </button>

            ) : (
              <></>
            )}

          </div>
        </div>
        {loading ? <TableSkeleton /> : (
          <GridComponent
            id="gridcomp"
            key={i18n.language}
            dataSource={agentData}
            allowPaging
            allowSorting
            allowExcelExport
            contextMenuItems={contextMenuItems}
            toolbar={toolbarOptions}
            allowResizing={true}

          >
            <ColumnsDirective>
              {orderAgentsAdmin(t).map((column, index) => (
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
                Search,
              ]}
            />
          </GridComponent>
        )}
      </div>
    </>
  );
};
