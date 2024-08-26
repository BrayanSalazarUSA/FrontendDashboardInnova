import React, { useState, useEffect, useRef, useContext } from "react";
import { Header } from "../components";
import { Toast } from "primereact/toast";
import "../pages/css/Outlet/Outlet.css";
import "../pages/css/Reports/Reports.css";
import TypewriterText from "../components/Texts/TypewriterTex";
import { useTranslation } from "react-i18next";
import { getRequests } from "../helper/getRequest";
import TableSkeleton from "../components/TableSkeleton";
import { MultiStateCheckbox } from "primereact/multistatecheckbox";

import logo from "../../assets/images/Logos/innova-monitoring.png";
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
  const { userContext } = useContext(UserContext);
  const [Updates, setUpdates] = useState(false);

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
    Navigate("/login");
  }

  useEffect(() => {
    const fetchRequest = async () => {
      setLoading(true);
      const requests = await getRequests();
      setRequests(requests);
      setLoading(false);
    };
    fetchRequest();
  }, [refreshTable]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const columns = GridRequests(setRefreshTable, userRole);
  const handleRowSelected = (e) => {
    setSelectedRequest(e.data);
    setModalOpen(true);
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
    setUpdates(false)
    setSelectedRequest({});
    setModalOpen(true);
  };

  return (
    <div className="mx-7 bg-white rounded-3xl overflow-auto">
    { userRole === "Client" ? (<h1>Sorry, you do not have access to the Requests.</h1>):(<div>  <div className="background">
        <Toast ref={toast} />
        <Header
          title={<TypewriterText text={`Requests`} />}
        />{" "}
        <button
          onClick={() => {
            handleOpen();
            setAddNewRequest(true);
          }}
          className="button"
        >
          Add Request
          <AiOutlinePlusCircle />
        </button>
      </div>
      <div className="flex flex-row">
        <div className="card flex w-full">
          <>
            <Toast ref={toast} />
            {loading ? (
              <TableSkeleton />
            ) : (
              <GridComponent
                id="gridcomp"
                dataSource={requests}
                allowPaging
                allowSorting
                allowExcelExport
                allowPdfExport
                contextMenuItems={contextMenuItems}
                toolbar={["Search"]}
                allowResizing
                rowSelected={handleRowSelected}
              >
                <Inject
                  services={[
                    Resize,
                    Sort,
                    ContextMenu,
                    Filter,
                    Page,
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
          )}</div>
      </Modal></div>)}
    </div>
  );
};

export default Request;
