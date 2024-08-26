import {
  ColumnDirective,
  ColumnsDirective,
  GridComponent,
} from "@syncfusion/ej2-react-grids";
import i18next from "i18next";
import React, { useEffect, useState, useMemo, useContext } from "react";
import { Button } from "primereact/button";
import {
  propertiesUserGridAdmin,
  propertiesUserGrid,
  assignproperties,
} from "../data/dummy";
import { useTranslation } from "react-i18next";
import { getNonPropertiesUser } from "../helper/userProfile/properties/getNonPropertiesUser";
import { getUserAssignedProperties } from "../helper/userProfile/properties/getUserAssignedProperties";
import TableSkeleton from "./TableSkeleton";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

const GridPropertiesProfile = ({ userId, setUserData }) => {
  const [t, i18n] = useTranslation("global");

  const { userContext } = useContext(UserContext);

  const navigate = useNavigate();

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

  const [dataToShow, setDataToShow] = useState([]);
  const [activeView, setActiveView] = useState("default");
  const [loading, setLoading] = useState(true);

  const fetchProperties = async () => {
    setLoading(true);

    if (activeView === "assign") {
      const nonAssignedProperties = await getNonPropertiesUser(userId);
      setDataToShow(nonAssignedProperties);
    } else {
      const assignedProperties = await getUserAssignedProperties(userId);
      setDataToShow(assignedProperties);
    }

    setLoading(false);
  };

  const fetchUpdatedProperties = async () => {
    setLoading(true);
    const nonAssignedProperties = await getNonPropertiesUser(userId);
    setDataToShow(nonAssignedProperties);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    fetchProperties();
    setLoading(true);
  }, [userId, activeView, i18n.language]);

  const columns = useMemo(() => {
    if (activeView === "default") {
      return propertiesUserGridAdmin(t, userId, fetchProperties, activeView);
    }
    return assignproperties(t, userId, fetchProperties, activeView);
  }, [t, userId, setUserData, activeView, fetchUpdatedProperties]);

  const handleViewChange = () => {
    setActiveView((prevView) =>
      prevView === "default" ? "assign" : "default"
    );
  };

  console.log("Data to show:", dataToShow);
  console.log("Columns:", columns);
  return (
    <div>
      <div className="flex justify-between align-middle p-6 mt-10">
        <h2 className="text-3xl text-primary font-bold sm:te  xt-xl">
          {t("dashboard.user-details.properties.assigned-properties")}
        </h2>
        {userRole === "Admin" && (
          <Button
            label={t(
              activeView === "default"
                ? "dashboard.user-details.properties.assign-properties"
                : "dashboard.user-details.properties.properties-user"
            )}
            className="p-button-text ml-2"
            onClick={handleViewChange}
          />
        )}
      </div>

      {loading ? (
        <TableSkeleton />
      ) : (
        <GridComponent
          id="userGrid"
          dataSource={dataToShow}
          key={`${activeView}-${i18n.language}`}
          allowPaging
          allowSorting
          toolbar={["Search"]}
        >
          <ColumnsDirective>
            {columns.map((column, index) => (
              <ColumnDirective key={index} {...column} />
            ))}
          </ColumnsDirective>
        </GridComponent>
      )}
    </div>
  );
};

export default GridPropertiesProfile;
