import React, { useState, useEffect, useRef, useContext } from "react";
import { Header } from "../components";
import { Toast } from "primereact/toast";
import "../pages/css/Outlet/Outlet.css";
import "../pages/css/Reports/Reports.css";
import TypewriterText from "../components/Texts/TypewriterTex";
import { useTranslation } from "react-i18next";
import { getRequests } from "../helper/getRequest";
import TableSkeleton from "../components/TableSkeleton";
import ChecklistIcon from "@mui/icons-material/Checklist";
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
import { GridRequests } from "../tablesTemplates/Reports/GridRequests";
import { Modal } from "@material-ui/core";

import RequestForm from "../components/Requests/RequestForm";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { UserContext } from "../../context/UserContext";
import { Navigate } from "react-router-dom";
import { Button } from "primereact/button";
import { update } from "react-spring";
import RequestChat from "../components/Requests/RequestChat";
import { Message } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";

const Request = () => {
  const toast = useRef(null);
  const property = JSON.parse(localStorage.getItem("propertySelected"));
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshTable, setRefreshTable] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [shouldSendRequest, setShouldSendRequest] = useState(false);
  const [addNewRequest, setAddNewRequest] = useState(true);
  const { t } = useTranslation("global");
  const { userContext, propertyContext } = useContext(UserContext);
  const [Updates, setUpdates] = useState(false);
  const [currentTitle, setCurrentTitle] = useState("");
  const [allRequest, setAllRequest] = useState(false);

  // Primero intentamos obtener el roleName desde el localStorage
  let user = JSON.parse(localStorage.getItem("user") || "{}");
  let userRole = user?.role?.rolName;

  const [propertyId, setPropertyId] = useState(property?.id || 0);
  let status;

  // Si no se encuentra en el localStorage, lo buscamos en el userContext
  if (!userRole && userContext && userContext.role) {
    console.log("No se ecnotró el role, configurando role del contexto");
    userRole = userContext.role.rolName;
  }

  // Si el roleName no se encuentra, redirigimos al login
  if (!userRole) {
    alert("Role is not defined, redirecting to login.");
    Navigate("/login");
  }

  const sortRequests = (requests) => {
    return requests.sort((a, b) => {
      const statusOrder = {
        "Not Started": 1,
        "In Process": 1,
        Expired: 1,
        Completed: 2,
      };
      const statusA = statusOrder[a.state] || 3;
      const statusB = statusOrder[b.state] || 3;

      if (statusA !== statusB) {
        return statusA - statusB;
      }
      return b.id - a.id; // Ordenar por ID de mayor a menor
    });
  };

  const paginationModel = { page: 0, pageSize: 8 };

  useEffect(() => {
    const fetchRequest = async () => {
      if (!allRequest) {
        setCurrentTitle("Request of " + propertyContext.name);
        setPropertyId(propertyContext.id);
      }

      setLoading(true);
      const requests = await getRequests(propertyId, status);
      const sortedRequests = sortRequests(requests);
      setRequests(sortedRequests);
      setLoading(false);
    };
    fetchRequest();
  }, [refreshTable, propertyId]);

  useEffect(() => {
    const fetchRequest = async () => {
      setAllRequest(false);
      setLoading(true);
      setCurrentTitle(`Request - ${propertyContext.name}`);
      const requests = await getRequests(propertyContext.id, status);
      setRequests(requests);
      setLoading(false);
    };
    fetchRequest();
  }, [refreshTable, propertyContext]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const columns = GridRequests(setRefreshTable, userRole,t);

  const handleRowSelected = (params) => {
    setSelectedRequest(params.row); // Store selected row data
    setModalOpen(true); // Open modal
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedRequest({ ...selectedRequest, [name]: value });
  };

  const handleSave = () => {
    // Lógica para guardar los cambios
    // Puede incluir una llamada a la API para actualizar los datos en el backend
    console.log("Datos guardados:", selectedRequest);
    setModalOpen(false);
  };

  const handleClose = () => {
    setAddNewRequest(false);
    setModalOpen(false);
    setRefreshTable((prev) => !prev);
  };

  const handleOpen = () => {
    setUpdates(false);
    setSelectedRequest({});
    setModalOpen(true);
  };

  const fetchAllRequest = () => {
    setPropertyId(null);
    setAllRequest(true);
    setCurrentTitle("All Requests");
  };

  const fetchPropertyRequest = () => {
    setPropertyId(property?.id);
    setCurrentTitle(
      `${t("dashboard.reports.reports-of")}${propertyContext.name}`
    );
  };

  return (
    <div className="mx-7 bg-white rounded-3xl overflow-auto">
      {userRole === "Client" ? (
        <h1>Sorry, you do not have access to the Requests.</h1>
      ) : (
        <div>
          {" "}
          <div className="background">
            <Toast ref={toast} />
            <Header title={<TypewriterText text={currentTitle} />} />{" "}
            <div className="card w-full  ml-4 flex">
              <button
                onClick={() => {
                  handleOpen();
                  setAddNewRequest(true);
                }}
                className="button"
              > 
                {t("dashboard.request.add-request")}
                <AiOutlinePlusCircle />
              </button>
              <button
                onClick={() => fetchPropertyRequest()}
                className="button ml-3"
              > 
               {t("dashboard.request.property-request")}
                <ChecklistIcon />
              </button>
              <button onClick={() => fetchAllRequest()} className="button ml-3">
             
                {t("dashboard.request.all-request")}
                <ChecklistIcon />
              </button>
            </div>
          </div>
          <div className="flex flex-row">
            <div className="card flex w-full">
              <>
                <Toast ref={toast} />
                {loading ? (
                  <TableSkeleton />
                ) : (
                  <div style={{ width: "100%" }}>
                    <DataGrid
                      rows={requests}
                      columns={columns}
                      initialState={{ pagination: { paginationModel } }}
                      pageSizeOptions={[5, 10]}
                      checkboxSelection={false}
                      loading={loading}
                      onRowClick={handleRowSelected}
                    />
                  </div>
                )}
              </>
            </div>
          </div>
          <Modal
            open={modalOpen}
            onClose={handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            className="dialog-request"
            style={{ zIndex: 1300 }}
          >
            <div>
              {!Updates ? (
                <RequestForm
                  handleClose={handleClose}
                  setRefreshTable={setRefreshTable}
                  refreshTable={refreshTable}
                  selectedRequest={selectedRequest}
                  setSelectedRequest={setSelectedRequest}
                  setShouldSendRequest={setShouldSendRequest}
                  shouldSendRequest={shouldSendRequest}
                  setAddNewRequest={setAddNewRequest}
                  addNewRequest={addNewRequest}
                  userRole={userRole}
                  setUpdates={setUpdates}
                />
              ) : (
                <RequestChat
                  handleClose={handleClose}
                  setRefreshTable={setRefreshTable}
                  refreshTable={refreshTable}
                  selectedRequest={selectedRequest}
                  setSelectedRequest={setSelectedRequest}
                  setShouldSendRequest={setShouldSendRequest}
                  shouldSendRequest={shouldSendRequest}
                  setAddNewRequest={setAddNewRequest}
                  addNewRequest={addNewRequest}
                  userRole={userRole}
                  setUpdates={setUpdates}
                />
              )}
            </div>
          </Modal>
        </div>
      )}
    </div>
  );
};

export default Request;
