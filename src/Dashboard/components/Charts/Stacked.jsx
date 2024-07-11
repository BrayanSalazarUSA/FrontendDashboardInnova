import React, { useContext, useEffect, useState } from "react";
import {
  ChartComponent,
  SeriesCollectionDirective,
  SeriesDirective,
  Inject,
  Legend,
  Category,
  StackingColumnSeries,
  Tooltip,
  LineSeries,
  DataLabel,
} from "@syncfusion/ej2-react-charts";

import { UserContext } from "../../../context/UserContext";
import getReportsMontly from "../../helper/getReportsByPropertyPie";
import ChartsHeader from "../ChartsHeader";
import Loading from "../../pages/Charts/Loading";
import { useTranslation } from "react-i18next";

const Stacked = () => {
  const { propertyContext } = useContext(UserContext);
  let propertyStorage = JSON.parse(localStorage.getItem("propertySelected"));
  let idStorage = propertyStorage.id;
  let id1 = propertyContext.id || idStorage;
  let user = JSON.parse(localStorage.getItem("user"));
  let userRole = user.rol?.rolName || "";
  const [t, i18n] = useTranslation("global");

  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getReportsMontly(
          propertyContext.id || id1,
          userRole
        );
        setReportes(data);
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
  console.log(reportes);

  return (
    <div className="mx-7 bg-white rounded-3xl overflow-auto">
      <ChartsHeader category="Reports Montly" translate={t} />
      {loading ? (
        <Loading />
      ) : (
        <ChartComponent
          id="charts"
          primaryXAxis={{
            valueType: "Category",
            title: "Linea Mes a Mes",
          }}
          primaryYAxis={{
            title: "Numero de Reportes",
          }}
          tooltip={{ enable: true }}
          background={"#fff"}
          legendSettings={{ background: "white" }}
        >
          <Inject
            services={[LineSeries, Legend, Tooltip, DataLabel, Category]}
          />
          <SeriesCollectionDirective>
            <SeriesDirective
              dataSource={reportes}
              xName="x"
              yName="y"
              type="Line"
              marker={{
                dataLabel: {
                  visible: true,
                  position: "Top",
                  font: { fontWeight: "600", color: "#ffffff" },
                },
              }}
            />
          </SeriesCollectionDirective>
        </ChartComponent>
      )}
    </div>
  );
};

export default Stacked;
