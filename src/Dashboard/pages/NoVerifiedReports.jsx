import React, { useEffect, useState, useCallback, useRef } from "react";
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

const NoVerifiedReports = () => {
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation("global");
  const toast = useRef(null);

  const fetchNonVerifiedReports = useCallback(async () => {
    setLoading(true);
    try {
      const nonVerifiedReports = await getReportsNoVerified();
      setReportes(nonVerifiedReports);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNonVerifiedReports();
  }, [fetchNonVerifiedReports]);

  const columns = ReportsGridNoVerified(t, fetchNonVerifiedReports);

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

export default NoVerifiedReports;
