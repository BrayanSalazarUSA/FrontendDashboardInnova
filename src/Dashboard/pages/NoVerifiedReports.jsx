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
import { contextMenuItems } from "../data/dummy";
import { ReportsGridNoVerified } from "../tablesDashboard/Reports/ReportsGridNoVerified";
import { getReportsNoVerified } from "../helper/getReportsNoVerified";
import TableSkeleton from "../components/TableSkeleton";
import { useTranslation } from "react-i18next";
import { Toast } from "primereact/toast";
import { getAllReports } from "../helper/Reports/dataTables/getAllReports";
import { UserContext } from "../../context/UserContext";

const NoVerifiedReports = ({userRole}) => {
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation("global");
  const toast = useRef(null);
  const { refreshReports, setRefreshReports } = useContext(UserContext);
  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      const fetchedReports = await getReportsNoVerified();
      setReportes(fetchedReports);
      setLoading(false);
    };

    fetchReports();
  }, [refreshReports]);

  const columns = ReportsGridNoVerified(t, setRefreshReports, userRole);

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
              <ColumnDirective  key={index} {...item} />
            ))}
          </ColumnsDirective>
        </GridComponent>
      )}
    </>
  );
};

export default NoVerifiedReports;
