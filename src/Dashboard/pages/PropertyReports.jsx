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
import { getReportsByProperty } from "../helper/getReportsByProperty";

const PropertyReports = () => {
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation("global");
  const toast = useRef(null);
  const { propertyContext, creatingReport, refreshReports, setRefreshReports } = useContext(UserContext);

  const user = JSON.parse(localStorage.getItem("user"));
  const userRole = user.role.rolName;
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

  const columns = reportsGridAdmin(t, setRefreshReports);



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
