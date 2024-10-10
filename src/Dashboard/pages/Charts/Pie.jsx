import React, { useEffect, useState, useContext } from "react";
import { ChartsHeader, Pie as PieChart } from "../../components";
import { useStateContext } from "../../../context/ContextProvider";
import { UserContext } from "../../../context/UserContext";
import { useTranslation } from "react-i18next";
import { UseDataStatics } from "../../Hooks/useDataStatics";
import { getReportsByProperty } from "../../helper/getReportsByProperty";
import Loading from "./Loading";
import NoReports from "./NoReports";
import { useNavigate } from "react-router-dom";

const Pie = () => {
  const { propertyContext, userContext } = useContext(UserContext);
  const [reportes, setReportes] = useState([]);
  const { t, i18n } = useTranslation("global");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { navigate } = useNavigate();

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
    const fetchData = async () => {
      try {
        const propertyStorage = JSON.parse(
          localStorage.getItem("propertySelected")
        );
        const idStorage = propertyStorage.id;

        const data = await getReportsByProperty(
          propertyContext.id || idStorage,
          userRole
        );
        const { unicosElementos, almacenadorDeVecesRepetidas, porcentajes } =  
        UseDataStatics(data,i18n);

        const finalChartData = unicosElementos.map((element, index) => ({
          x: element,
          y: almacenadorDeVecesRepetidas[index],
          text: porcentajes[index],
        }));

        setReportes(finalChartData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [propertyContext, i18n.language]); // Dependencias actualizadas para reaccionar al cambio de idioma

  if (error) {
    return <div className="error">{error}</div>; // Mostrar mensaje de error si hay un error
  }

  return (
    <div className="mx-7 bg-white rounded-3xl overflow-auto">
      <ChartsHeader category={t("dashboard.tipes-of-cases.types-cases")} translate={t} /> 
      {loading ? (
        <Loading />
      ) : (
        <div className="relative box-border block">
          {reportes.length > 0 ? (
            <PieChart id="chart-pie" data={reportes} legendVisiblity />
          ) : (
            <NoReports />
          )}
        </div>
      )}
    </div>
  );
};

export default Pie;
