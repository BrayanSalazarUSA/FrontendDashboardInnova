import React from "react";

import { pieChartData } from "../../data/dummy";
import { ChartsHeader, Pie as PieChart } from "../../components";
import { useStateContext } from "../../../context/ContextProvider";
import { useEffect } from "react";
import '../css/Outlet/Outlet.css'
import { useContext } from "react";
import { UserContext } from "../../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { UseDataPieLevels } from "../../Hooks/useDataPieLevels";
import { useTranslation

 } from "react-i18next";
import { getReportsByPropertyToStats } from "../../helper/getReportsByPropertyToStats";
import Loading from "./Loading";
import NoReports from "./NoReports";
import { getReportsByProperty } from "../../helper/getReportsByProperty";
import { Chart, ChartComponent } from "@syncfusion/ej2-react-charts";
const PieLevels = () => {
  const { propertyContext, userContext} = useContext(UserContext);
  const navigate = useNavigate();
  let propertyStorage = JSON.parse(localStorage.getItem("propertySelected"));
  let idStorage = propertyStorage.id;
  let id1 = propertyContext.id || idStorage;

  const [reportes, setReportes] = useState([]);
  const [t, i18n] = useTranslation("global");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  
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


  let finalChart = [];
  const calculate = (data) => {
    
    const { unicosElementos, almacenadorDeVecesRepetidas, porcentajes } =
    UseDataPieLevels(data, t);

    for (let k = 0; k < unicosElementos.length; k++) {
      finalChart.push({
        x: unicosElementos[k],
        y: almacenadorDeVecesRepetidas[k],
        text: porcentajes[k],
      });
    }

    setReportes(finalChart);
    finalChart = [];
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setReportes([]);
        const data = await getReportsByProperty(propertyContext.id || idStorage, userRole);
        calculate(data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [propertyContext]);

  if (error) {
    return <div className="error">{error}</div>; // Mostrar mensaje de error si hay un error
  }

  return (
    <div className="mx-7 bg-white rounded-3xl overflow-auto">
     <ChartsHeader category={t("dashboard.reporting levels.cases-levels")} translate={t} />
    {loading ? (<Loading/>) : (
       <div className="relative box-border block">

       {reportes.length > 0 ? (
        <PieChart
         id="chart-pie"
         data={reportes}
         legendVisiblity
       />) : (
       <NoReports/>
       )}
       </div>
    )
    }
         </div>
  );
};

export default PieLevels;
