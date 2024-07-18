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
import { contextMenuItems, reportsGridAdmin } from "../data/dummy";
import { getNumberOfReportsByRole } from "../helper/Reports/dataTables/getNumberOfReportsByRole";
import TableSkeleton from "../components/TableSkeleton";
import { useTranslation } from "react-i18next";
import { Toast } from "primereact/toast";
import { UserContext } from "../../context/UserContext";

const PropertyReports = () => {
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation("global");
  const toast = useRef(null);
  const { propertyContext } = useContext(UserContext);

  const user = JSON.parse(localStorage.getItem("user"));
  const userRole = user.role.rolName;
  const propertyStorage = JSON.parse(localStorage.getItem("propertySelected"));
  const idStorage = propertyStorage.id;
  const id = propertyContext.id || idStorage;

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const reports = await getNumberOfReportsByRole(id, user.id, userRole);
      setReportes(reports);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener los reportes:", error);
      setLoading(false);
    }
  }, [id, user.id, userRole]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const columns = reportsGridAdmin(t, fetchReports);

  return (
    <>
      <Toast ref={toast} />
      {loading ? (
        <TableSkeleton />
      ) : (
        <GridComponent
          id="gridcomp"
          dataSource={reportes}
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
