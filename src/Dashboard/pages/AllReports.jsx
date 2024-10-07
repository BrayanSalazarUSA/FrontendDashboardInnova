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

const AllReports = ({userRole}) => {

  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation("global");
  const toast = useRef(null);
  const { refreshReports, setRefreshReports, modalReport, setModalReport } = useContext(UserContext);
  const gridRef = useRef(null); // Ref para el componente Grid
  const [currentPage, setCurrentPage] = useState(1)

  const fetchReports = async () => {
    setLoading(true);
    const fetchedReports = await getAllReports();
    setReportes(fetchedReports);
    setLoading(false);
  };

  useEffect(() => {
    fetchReports();
  }, [refreshReports]);

  useEffect(() => {
    if (!loading && gridRef.current) {
      const currentPage = gridRef.current.pagerModule.currentPage; // Obtener la página actual
      gridRef.current.goToPage(currentPage); // Restaurar la página actual después del refresh
    }
  }, [loading, refreshReports]);

  const columns = GridAllReports(t, setRefreshReports, userRole);

  const handlePageChange = (event) => {
    const currentPage = gridRef.current.pageSettings.currentPage; // Obtener la página actual
    setCurrentPage(currentPage);
    console.log(gridRef.current.pageSettings.currentPage)
  };

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
          ref={gridRef} // Asignar la ref
          pageSettings={{ currentPage: currentPage }}
          dataBound={handlePageChange} // Manejar el cambio de página
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
