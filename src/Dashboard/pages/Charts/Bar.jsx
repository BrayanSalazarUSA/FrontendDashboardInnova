import React, { useEffect, useState, useContext } from "react";
import {
  ChartComponent,
  SeriesCollectionDirective,
  SeriesDirective,
  Inject,
  Legend,
  Category,
  Tooltip,
  ColumnSeries,
  DataLabel,
} from "@syncfusion/ej2-react-charts";
import { Button } from "primereact/button";
import { ChartsHeader } from "../../components";
import { useStateContext } from "../../../context/ContextProvider";
import { getReportsByPropertyToStats } from "../../helper/getReportsByPropertyToStats";
import { UserContext } from "../../../context/UserContext";
import { useTranslation } from "react-i18next";
import { t } from "i18next";
import '../css/Outlet/Outlet.css'
import { AiOutlinePlusCircle } from "react-icons/ai";
import Loading from "./Loading";
import NoReports from "./NoReports";
 // Suponiendo que tienes un componente de Loader

const Bar = () => {
  const { propertyContext } = useContext(UserContext);
  const { currentMode } = useStateContext();
  const [reportes, setReportes] = useState([]);
  const [reportesFormated, setReportesFormated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [t, i18n] = useTranslation("global");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const propertyStorage = JSON.parse(localStorage.getItem("propertySelected"));
        const user = JSON.parse(localStorage.getItem("user"));
        const idStorage = propertyStorage.id;
        const userRole = user.role.rolName;
        // Trae reportes por propiedad, si el cliente le muestra solo verificados (Se filtra desde front)
        const data = await getReportsByPropertyToStats(propertyContext.id || idStorage, userRole);
        console.log(data);
        setReportes(data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [propertyContext, i18n.language]);

  
  if (error) {
    return <div className="error">{error}</div>; // Mostrar mensaje de error si hay un error
  }

  return (
    <div className="mx-7 bg-white rounded-3xl overflow-auto">
      <ChartsHeader category="dashboard.charts.report-bar.report-bar-header" translate={t} />
      
      {loading ? (
        <Loading />
      ) : (
        <>
          {reportes.length > 0 ? (
            <ChartComponent
              id="charts"
              key={i18n.language}
              primaryXAxis={{
                valueType: "Category",
              }}
              primaryYAxis={{
                title: t('dashboard.charts.report-bar.number-of-reports'),
              }}
              tooltip={{ enable: true }}
              background={currentMode === "Dark" ? "#33373E" : "#fff"}
              legendSettings={{ background: "white" }}
            >
              <Inject services={[ColumnSeries, Legend, Tooltip, DataLabel, Category]} />
              <SeriesCollectionDirective>
                <SeriesDirective
                  dataSource={reportes}
                  xName="x"
                  yName="y"
                  type="Column"
                  marker={{
                    dataLabel: {
                      visible: true,
                      position: "Top",
                      font: { fontWeight: "600", color: "#ffffff" }
                    }
                  }}
                />
              </SeriesCollectionDirective>
            </ChartComponent>
          ) : (
            <NoReports/> // Usar el nuevo componente de mensaje amigable
          )}
        </>
      )}
    </div>
  );
};

export default Bar;
