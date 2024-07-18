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
import { GridAllReports } from "../tablesDashboard/Reports/GridAllReports";
import { getAllReports } from "../helper/Reports/dataTables/getAllReports";
import TableSkeleton from "../components/TableSkeleton";
import { useTranslation } from "react-i18next";
import { Toast } from "primereact/toast";

const AllReports = () => {
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation("global");
  const toast = useRef(null);

  const fetchAllReports = useCallback(async () => {
    setLoading(true);
    try {
      const allreports = await getAllReports();
      setReportes(allreports);
      setLoading(false);
    } catch (error) {
      console.error("Error buscando todos los reportes", error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllReports();
  }, [fetchAllReports]);

  const columns = GridAllReports(t, fetchAllReports);

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

export default AllReports;
