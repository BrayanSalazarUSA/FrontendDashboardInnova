import React, { useState, useEffect, useRef } from "react";
import { Header } from "../components";
import { Toast } from "primereact/toast";
import "../pages/css/Outlet/Outlet.css";
import "../pages/css/Reports/Reports.css";
import TypewriterText from "../components/Texts/TypewriterTex";
import { useTranslation } from "react-i18next";
import { getRequests } from "../helper/getRequest";
import TableSkeleton from "../components/TableSkeleton";
import { MultiStateCheckbox } from 'primereact/multistatecheckbox';

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
import { GridRequests, GridRequestsState } from "../tablesTemplates/Reports/GridRequests";
import {
  Typography,
  Modal,
  Box,
  TextareaAutosize,
  InputLabel,
  Select,
  Chip,
  styled,
} from "@material-ui/core";


import { TextField, Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { MultiStepForm } from "../../components/MultiStepForm/MultiStepForm";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputTextarea } from "primereact/inputtextarea";
import { InputSwitch } from "primereact/inputswitch";
import { TbRuler2 } from "react-icons/tb";
import RequestForm from "../components/Requests/RequestForm";

const Request = () => {
  const toast = useRef(null);
  const property = JSON.parse(localStorage.getItem("propertySelected"));
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshTable, setRefreshTable] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { t } = useTranslation("global");
  const [visible, setVisible] = useState(false);
 
  

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

  const columns = GridRequests();
  const handleRowSelected = (e) => {
    setSelectedRequest(e.data);
    setModalOpen(true);
    setVisible(true);
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
    setModalOpen(false);
  };

  return (
    <div className="mx-7 bg-white rounded-3xl overflow-auto">
      <div className="background">
        <Toast ref={toast} />
        <Header
          title={<TypewriterText text={`Request - ${property?.name}`} />}
        />
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
        style={{ zIndex: 1300 }}  >
        <RequestForm selectedRequest={selectedRequest} setSelectedRequest={setSelectedRequest}/>
      </Modal>
    </div>
  );
};


export default Request;
