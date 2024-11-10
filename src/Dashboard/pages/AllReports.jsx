import React, { useEffect, useState, useRef, useContext } from "react";
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Inject,
  Resize,
  Sort,
  ContextMenu,
  Filter,
  Page,
  PdfExport,
  Search,
  Toolbar,
} from "@syncfusion/ej2-react-grids";
import { contextMenuItems } from "../data/dummy";
import { GridAllReports } from "../tablesDashboard/Reports/GridAllReports";
import { getAllReports } from "../helper/Reports/dataTables/getAllReports";
import TableSkeleton from "../components/TableSkeleton";
import { useTranslation } from "react-i18next";
import { Toast } from "primereact/toast";
import { UserContext } from "../../context/UserContext";
import { Pagination, Stack } from "@mui/material";

const AllReports = ({ userRole }) => {
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation("global");
  const toast = useRef(null);
  const { refreshReports, setRefreshReports, modalReport, setModalReport } =
    useContext(UserContext);
  const gridRef = useRef(null); // Ref para el componente Grid
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9); // Tamaño de página
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);

  const fetchReports = async (newPage) => {
    setLoading(true);
    const fetchedReports = await getAllReports(newPage-1 || 0, pageSize);
    setReportes(fetchedReports.content);
    setTotalPages(fetchedReports.totalPages); // Total de páginas desde la respuesta
    setLoading(false);
  };

  useEffect(() => {
    fetchReports();
  }, [refreshReports, page]);

  const columns = GridAllReports(t, setRefreshReports, userRole);

  const handlePageChange = (event, newPage) => {
    handleClear();
    setCurrentPage(newPage); // Actualiza la página actual
    fetchReports(newPage);
    console.log("newPage");
    console.log(newPage);
  };

  const handleClear = () => {
    setReportes([]);
  };

  return (
    <>
      <Toast ref={toast} />
      {loading ? (
        <TableSkeleton />
      ) : (
        <>
          <GridComponent
            id="gridcomp"
            dataSource={reportes}
            allowSorting={true}
            allowExcelExport={true}
            allowPdfExport={true}
            contextMenuItems={contextMenuItems}
            toolbar={["Search"]}
            allowResizing={true}
            ref={gridRef}
            actionComplete={handlePageChange} // Manejador del cambio de página
          >
            <Inject
              services={[
                Resize,
                Sort,
                ContextMenu,
                Filter,
                PdfExport,
                Search,
                Toolbar,
              ]}
            />
            <ColumnsDirective>
              {columns.map((item, index) => (
                <ColumnDirective key={index} {...item} />
              ))}
            </ColumnsDirective>
          </GridComponent>
          <Stack spacing={2} alignItems="left" sx={{ marginTop: 2 }}>
            <Pagination
              count={totalPages} // Total de páginas que quieres mostrar
              page={currentPage} // Página actual
              onChange={handlePageChange} // Manejador del cambio de página
              color="primary" // Cambia el color según el diseño
            />
          </Stack>
        </>
      )}
    </>
  );
};

export default AllReports;
