import React, { useEffect, useState, useCallback, useRef, useContext } from "react";
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
  Toolbar,
} from "@syncfusion/ej2-react-grids";
import { contextMenuItems, reportsGridAdmin, reportsGridProperty } from "../data/dummy";
import { getNumberOfReportsByRole } from "../helper/Reports/dataTables/getNumberOfReportsByRole";
import TableSkeleton from "../components/TableSkeleton";
import { useTranslation } from "react-i18next";
import { Toast } from "primereact/toast";
import { UserContext } from "../../context/UserContext";
import { getReportsByProperty } from "../helper/getReportsByProperty";
import { useNavigate } from "react-router-dom";

const PropertyReports = () => {
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation("global");
  const toast = useRef(null);
  const { propertyContext, creatingReport, refreshReports, setRefreshReports } = useContext(UserContext);

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


  const propertyStorage = JSON.parse(localStorage.getItem("propertySelected"));
  const idStorage = propertyStorage.id;
  const propertyId = propertyContext.id || idStorage;

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      const fetchedReports = await getReportsByProperty(propertyId, userRole);
      setReportes(fetchedReports);
      setLoading(false);
    };

    fetchReports();
  }, [propertyId, userRole, creatingReport, refreshReports]);

  const onRowDataBound = (args) => {
    console.log('args')
    console.log(args)
    // Verifica si el atributo "verified" es falso para aplicar el estilo
    if (args?.data?.messages?.lenght > 0) {
      args.row.style.backgroundColor = "#FFF9C4"; // Cambia el color de fondo a naranja
    } 
  };

  const columns = reportsGridProperty(t, setRefreshReports, userRole);

  return (
    <>
      <Toast ref={toast} />
      {loading ? (
        <TableSkeleton />
      ) : (
        <GridComponent
          id="gridcomp"
          dataSource={reportes}
          rowDataBound={onRowDataBound} // Añade el evento aquí
          allowPaging
          allowSorting
          allowExcelExport
          allowPdfExport
          contextMenuItems={contextMenuItems}
          toolbar={["Search"]}
          allowResizing
        >
          <Inject services={[Resize, Sort, ContextMenu, Filter, Page, PdfExport, Search, Toolbar]} />
          <ColumnsDirective>
            {columns.map((item, index) => (
              <ColumnDirective key={index} {...item} />
            ))}
          </ColumnsDirective>
        </GridComponent>
      )}
    </>
  );
};

export default PropertyReports;
