import React, { useContext, useEffect, useState, useRef } from "react";
import { getReportsByKeyword } from "../helper/Reports/dataTables/searchReportKeyword";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProgressSpinner } from "primereact/progressspinner";
import { UserContext } from "../../context/UserContext";
import { useTranslation } from "react-i18next";
import withErrorBoundary from "../Hooks/withErrorBoundary";
import Swal from "sweetalert2";
import {
  GridDetails,
  GridEditReportTemplate,
  GridNotification,
  GridPdf,
} from "../data/dummy";
import { GridIVoidedReport } from "../tablesTemplates/Reports/GridIVoidedReport";
import GridSendReport from "../tablesDashboard/GridSendReport";
import { GridLevelReport } from "../tablesTemplates/Reports/GridLevelReport";
import { GridArchiveReport } from "../tablesTemplates/GridArchiveReport";
import TableSkeleton from "../components/TableSkeleton";
import { ReportSearchModal } from "../components/Reports/ReportSearchModal";
import { getUsersDTO } from "../helper/getUsersDTO";
import { getPropertiesInfo } from "../helper/getProperties";
import { getIncidents } from "../helper/Incidents/getIncidents";

const SearchReports = ({ userRole }) => {
  
  const [keyword, setKeyword] = useState("");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation("global");
  const { setRefreshReports } = useContext(UserContext);
  const [totalRecords, setTotalRecords] = useState(0);
  const [first, setFirst] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para abrir/cerrar el modal
  const [properties, setProperties] = useState([]);
  const [users, setUsers] = useState([]);
  const [caseTypes, setCaseTypes] = useState([]);

  const fetchData = async () => {
    const agentsResponse = await getUsersDTO(); // Suponiendo que getUsersDTO es una función que hace la petición
    setUsers(agentsResponse);
    const propertiesResponse = await getPropertiesInfo();
    setProperties(propertiesResponse);
    const cases = await getIncidents();
    setCaseTypes(cases);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchReports = async (searchValue = keyword, filters = {}) => {
    console.log(keyword.length);
    if (keyword === "" || keyword.length < 3) {
      console.log(keyword);
      alert("Por favor ingrese una palabra clave para realizar la busqueda!");
      return;
    }
    if (keyword.length < 3) {
      console.log(keyword);
      alert("Por favor ingrese una palabra clave con más de 5 caracteres");
      return;
    } else {
      try {
        setLoading(true);
        const fetchedReports = await getReportsByKeyword(searchValue, filters);
        setReports(fetchedReports);
        setTotalRecords(fetchedReports.length);
      } catch (error) {
        console.error("Error fetching reports:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to fetch reports. Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  // Manejar el cierre del modal y aplicar los filtros
  const handleModalClose = (filters) => {
    setIsModalOpen(false);
    if (filters) {
      fetchReports(keyword, filters); // Usa los filtros obtenidos del modal
    }
  };

  // Handle search input and trigger fetch on "Enter"
  const handleSearchChange = (e) => {
    if (e.key === "Enter") {
      fetchReports(e.target.value);
    }
  };

  // Reset the search and data
  const handleClear = () => {
    setKeyword("");
    setReports([]);
    setTotalRecords(0);
    setFirst(0);
  };

  // Pagination
  const onPage = (event) => {
    setFirst(event.first);
  };

  // Column setup
  const columns = [
    {
      width: "50",
      textAlign: "Center",
      body: (props) => <GridNotification {...props} />,
    },
    {
      width: "50",
      textAlign: "Center",
      body: (props) => (
        <GridArchiveReport {...props} setRefreshReports={setRefreshReports} />
      ),
    },
    {
      headerText: t("dashboard.reports.table.admin-all-reports.property"),
      field: "property.name",
      textAlign: "Center",
      width: "145",
    },
    {
      field: "caseType.incident",
      headerText: t("dashboard.reports.table.admin-all-reports.Case"),
      width: "120",
      editType: "dropdownedit",
      textAlign: "Center",
    },
    {
      field: "createdBy.name",
      headerText: t("dashboard.reports.table.admin-all-reports.Agent"),
      width: "130",
      editType: "dropdownedit",
      textAlign: "Center",
    },
    {
      field: "level",
      headerText: "L",
      width: "10",
      format: "yMd",
      textAlign: "Center",
      body: (props) => <GridLevelReport {...props} />,
    },
    {
      field: "dateOfReport",
      headerText: t("dashboard.reports.table.admin-all-reports.DateCase"),
      width: "130",
      textAlign: "Center",
    },
    {
      field: "send",
      headerText: "Sent",
      width: "150",
      textAlign: "Center",
      body: (props) => <GridSendReport {...props} />,
    },
    {
      field: "numerCase",
      headerText: t("dashboard.reports.table.admin-all-reports.IdCase"),
      width: "110",
      textAlign: "Center",
    },
    {
      field: "PDF",
      headerText: "PDF",
      width: "80",
      textAlign: "Center",
      body: (props) => <GridPdf {...props} />,
    },
    {
      field: "Details",
      headerText: t("dashboard.reports.table.admin-all-reports.CaseDetails"),
      width: "100",
      textAlign: "Center",
      body: (props) => <GridDetails {...props} />,
    },
    {
      field: "verified",
      headerText: t("dashboard.reports.table.admin-all-reports.CaseVerified"),
      width: "110",
      textAlign: "Center",
      body: (props) => <GridIVoidedReport {...props} />,
    },
    {
      field: "Edit",
      headerText: t("dashboard.reports.table.admin-all-reports.CaseEdit"),
      width: "80",
      textAlign: "Center",
      body: (props) => <GridEditReportTemplate {...props} />,
    },
  ];

  return (
    <>
   <div className="flex justify-center mt-4">
  <div className="flex items-center w-full max-w-md bg-gray-100 rounded-full shadow-md p-2">
    <Button
      icon="pi pi-search"
      className="p-button-text p-button-plain text-gray-500 ml-2"
      onClick={() => fetchReports()}
    />
    <InputText
      value={keyword}
      placeholder="Buscar en Reportes"
      onKeyDown={handleSearchChange}
      onChange={(e) => setKeyword(e.target.value)}
      className="w-full border-none bg-transparent focus:outline-none px-2 text-sm text-gray-800"
    />
    {keyword && (
      <Button
        icon="pi pi-times"
        className="p-button-text p-button-plain text-gray-500 mr-2"
        onClick={handleClear}
      />
    )}
    <Button
      icon="pi pi-filter"
      className="p-button-text p-button-plain text-gray-500 mr-2"
      onClick={() => setIsModalOpen(true)}
    />
  </div>
</div>
      {loading ? (
        <div className="p-d-flex p-jc-center">
          {/* <ProgressSpinner /> */}
          <TableSkeleton />
        </div>
      ) : (
        <DataTable
          value={reports}
          paginator
          rows={10}
          totalRecords={totalRecords}
          first={first}
          onPage={onPage}
          emptyMessage={"No hay datos"}
          sortField="dateOfReport" // Campo por el cual ordenar inicialmente
          sortOrder={-1} // -1 para descendente, 1 para ascendente
        >
          {columns.map((col, i) => (
            <Column
              key={i}
              field={col.field}
              header={col.header}
              body={col.body}
            />
          ))}
        </DataTable>
      )}

      {/* Modal de búsqueda avanzada */}
      {isModalOpen && (
        <ReportSearchModal
          onClose={handleModalClose}
          visible={isModalOpen}
          handleClear={handleClear}
          setReports={setReports}
          handleModalClose={handleModalClose}
          users={users}
          properties={properties}
          caseTypes={caseTypes}
        />
      )}
    </>
  );
};

export default withErrorBoundary(SearchReports);
