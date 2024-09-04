import React, { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Header } from "../components";
import { UserContext } from "../../context/UserContext";
import { useStateContext } from "../../context/ContextProvider";
import { AiOutlinePlusCircle } from "react-icons/ai";
import ChecklistIcon from "@mui/icons-material/Checklist";
import { Toast } from "primereact/toast";
import "../pages/css/Outlet/Outlet.css";
import "../pages/css/Reports/Reports.css";
import TypewriterText from "../components/Texts/TypewriterTex";
import NoVerifiedReports from "./NoVerifiedReports";
import AllReports from "./AllReports";
import PropertyReports from "./PropertyReports";
import Stomp from "stompjs";
import { ProgressBar } from "primereact/progressbar";
import { FaUpload } from "react-icons/fa";
import { GoGear } from "react-icons/go";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
const Reports = () => {
  const navigate = useNavigate();
  const {
    propertyContext,
    creatingReport,
    userContext,
    modalReport,
    setModalReport,
    reportProgess, setReportProgess
  } = useContext(UserContext);
  const [activeView, setActiveView] = useState("default");
  const [actualProcess, setActualProcess] = useState("");
  const [visible, setVisible] = useState(false);
  const [progressData, setProgressData] = useState([]); // Estado global/local
  const { t } = useTranslation("global");
  const { activeMenu } = useStateContext();
  const toast = useRef(null);
  const audioRef = useRef(null);

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
    navigate("/login");
  }

  const [currentTitle, setCurrentTitle] = useState(
    `${t("dashboard.reports.reports-of")}${propertyContext.name}`
  );

  /*useEffect(() => {
    if (!creatingReport) {
      const timer = setTimeout(() => {
        setActiveView("default");
        setCurrentTitle(`${t("dashboard.reports.reports-of")}${propertyContext.name}`);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [creatingReport, propertyContext.name, t]);*/

  useEffect(() => {
    // Desplazar hacia arriba al cargar el componente
    window.scrollTo(0, 0);
    setReportProgess(0)
  }, []);

  useEffect(() => {
    setCurrentTitle(
      `${t("dashboard.reports.reports-of")}${propertyContext.name}`
    );
  }, [propertyContext.name, t]);

  useEffect(() => {
    const socketUrl = process.env.REACT_APP_WEB_SOCKET_IP; // URL del WebSocket del servidor Spring Boot
    console.log("socketUrl");
    console.log(socketUrl);
    const socket = new WebSocket(socketUrl);
    const stompClient = Stomp.over(socket);
    console.log("user.id.toString()");
    console.log(user.id.toString());
    stompClient.connect({}, () => {
      console.log(`/topic/user/user-${user.id.toString()}`);
      stompClient.subscribe(
        `/topic/user/user-${user.id.toString()}`,
        (response) => {
          const data = JSON.parse(response.body);
          handleIncomingMessage(data);
          /* if (
            toast.current != null &&
            JSON.parse(newMessage).message === "success"
          ) {
            console.log();
            console.log(JSON.parse(newMessage));
            toast?.current?.show({
              severity: "success",
              summary: "Info",
              detail: JSON.parse(newMessage).type,
            });
            setActualProcess(JSON.parse(newMessage).type);
          } */
        }
      );
    });
    /* 
    stompClient.connect({}, () => {
      stompClient.subscribe(`/topic/report/${modalReport?.id}`, (message) => {
        const receivedMessage = JSON.parse(message.body);
      });
    }); */

    return () => {
      toast.current = null;
    };
  }, []);


  const renderActiveView = () => {
    switch (activeView) {
      case "noVerified":
        return <NoVerifiedReports userRole={userRole} />;
      case "allReports":
        return <AllReports userRole={userRole} />;
      default:
        return <PropertyReports userRole={userRole} />;
    }
  };

   
  const handleIncomingMessage = (data) => {
    setProgressData(prevData => {
        // Verifica si el video ya existe en el estado actual
        const existingIndex = prevData.findIndex(item => item.fileName === data.fileName);

        if (existingIndex >= 0) {
            // Actualiza la información existente del video
            const updatedData = [...prevData];
            updatedData[existingIndex] = {
                ...updatedData[existingIndex],
                ...data
            };
            return updatedData;
        } else {
            // Agrega un nuevo video a la lista
            return [...prevData, data];
        }
    });
};



  return (
    <div className="mx-7 bg-white rounded-3xl overflow-auto">
      <Dialog
        header="Evidences Status"
        visible={visible}
        style={{ width: "70vw" }}
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
      >
           <DataTable value={progressData} responsiveLayout="scroll">
                <Column field="fileName" header="Nombre del Archivo"></Column>
                <Column field="type" header="Estado"></Column>
                <Column header="Porcentaje" body={(rowData) => (
                    <ProgressBar value={rowData.percent || 0} />
                )}></Column>
                <Column field="message" header="Mensaje"></Column>
                <Column header="Conversión" body={(rowData) => {
                    if (rowData.conversionRequired) {
                        if (rowData.conversionSatus === "success") {
                            return "Convertido";
                        } else if (rowData.conversionSatus === "failed") {
                            return "Fallido";
                        } else {
                            return "No necesario";
                        }
                    } else {
                        return "No requerido";
                    }
                }}></Column>
                <Column field="error" header="Error" body={(rowData) => rowData.error || "N/A"}></Column>
            </DataTable>
      </Dialog>
      <div className="background">
        <Header title={<TypewriterText text={currentTitle} />} />
       {/* {creatingReport && (  */}
        <div className="card flex flex-row mx-auto my-3">
          {/* <div className="loader flex flex-col">
              <div className="loader-inner">
                <div className="loader-block"></div>
                <div className="loader-block"></div>
                <div className="loader-block"></div>
                <div className="loader-block"></div>
                <div className="loader-block"></div>
                <div className="loader-block"></div>
                <div className="loader-block"></div>
                <div className="loader-block"></div>
              </div>
            </div> */}
          <div className="card w-1/2 mt-1">
            <ProgressBar value={reportProgess}></ProgressBar>
            <span className="text-[#d6aa25]">{actualProcess}</span>
          </div>
          <div className="card w-1/2 ml-4 ">
            <button
              class="button-evidences"
              onClick={() => {
                setVisible(true);
                console.log("jkh");
              }}
            >
              <GoGear style={{ color: "white" }} />
            </button>
          </div>
        </div>
        {/*   )} */}
        <Toast ref={toast} />
        <div className="card flex justify-start">
          {(userRole === "Admin" ||
            userRole === "Monitor" ||
            userRole === "Supervisor") && (
            <>
              <button
                onClick={() => navigate("/dashboard/NewReport")}
                className="button"
              >
                {t("dashboard.reports.buttons.add-report")}
                <AiOutlinePlusCircle />
              </button>
              <span className="w-5"> </span>
              {(userRole === "Admin" || userRole === "Supervisor") && (
                <>
                  <button
                    className="button"
                    onClick={() => {
                      setActiveView("default");
                      setCurrentTitle(
                        `${t("dashboard.reports.reports-of")}${
                          propertyContext.name
                        }`
                      );
                    }}
                  >
                    {t("dashboard.reports.buttons.reports-per-property")}
                    <ChecklistIcon />
                  </button>
                  <button
                    className="button ml-7"
                    onClick={() => {
                      setActiveView("allReports");
                      setCurrentTitle(
                        t("dashboard.reports.buttons.all-reports")
                      );
                    }}
                  >
                    {t("dashboard.reports.buttons.all-reports")}
                    <ChecklistIcon />
                  </button>
                  <button
                    className="button ml-7"
                    onClick={() => {
                      setActiveView("noVerified");
                      setCurrentTitle(
                        t("dashboard.reports.buttons.non-verified-reports")
                      );
                    }}
                  >
                    {t("dashboard.reports.buttons.non-verified-reports")}
                    <ChecklistIcon />
                  </button>
                  <span className="w-5"></span>
                </>
              )}
            </>
          )}
        </div>
      </div>
      {renderActiveView()}
    </div>
  );
};

export default Reports;
