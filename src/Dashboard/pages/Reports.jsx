import React, { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Header } from "../components";
import { UserContext } from "../../context/UserContext";
import { useStateContext } from "../../context/ContextProvider";
import { AiOutlinePlusCircle } from "react-icons/ai";
import ChecklistIcon from "@mui/icons-material/Checklist";
import { Toast } from "primereact/toast";
import '../pages/css/Outlet/Outlet.css';
import '../pages/css/Reports/Reports.css';
import TypewriterText from "../components/Texts/TypewriterTex";
import NoVerifiedReports from "./NoVerifiedReports";
import AllReports from "./AllReports";
import PropertyReports from "./PropertyReports";
import Stomp from "stompjs";

const Reports = () => {
  const navigate = useNavigate();
  const { propertyContext, creatingReport, userContext, modalReport, setModalReport } = useContext(UserContext);
  const [activeView, setActiveView] = useState("default");
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


  const [currentTitle, setCurrentTitle] = useState(`${t("dashboard.reports.reports-of")}${propertyContext.name}`);

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
  }, []);

  useEffect(() => {
    setCurrentTitle(`${t("dashboard.reports.reports-of")}${propertyContext.name}`);
  }, [propertyContext.name, t]);

  useEffect(() => {
    const socketUrl = process.env.REACT_APP_WEB_SOCKET_IP;// URL del WebSocket del servidor Spring Boot
    console.log('socketUrl');
    console.log(socketUrl);
    const socket = new WebSocket(socketUrl); 
    const stompClient = Stomp.over(socket);
    stompClient.connect({}, () => {
      console.log(`/topic/user/user-${user.id.toString()}`);
      stompClient.subscribe(
        `/topic/user/user-${user.id.toString()}`,
        (response) => {
          const newMessage = response.body;
          if (toast.current != null) {
            console.log();
            console.log(newMessage);
            toast?.current?.show({
              severity: "success",
              summary: "Info",
              detail: JSON.parse(newMessage).type,
            });
          }
        }
      );
    });

    stompClient.connect({}, () => {
      stompClient.subscribe(`/topic/report/${modalReport?.id}`, (message) => {
        const receivedMessage = JSON.parse(message.body);
      });
    });

    return () => {
      toast.current = null;
    };
  }, []);


  const renderActiveView = () => {
    switch (activeView) {
      case "noVerified":
        return <NoVerifiedReports userRole={userRole}/>;
      case "allReports":
        return <AllReports userRole={userRole}/>;
      default:
        return <PropertyReports userRole={userRole}/>;
    }
  };

  return (
    <div className="mx-7 bg-white rounded-3xl overflow-auto">
      <div className="background">
        {creatingReport && (
          <div className="card flex flex-col mx-auto ml-10">
            <div className="loader flex flex-col">
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
            </div>
          </div>
        )}


        <Header title={<TypewriterText text={currentTitle} />} />
        <Toast ref={toast} />
        <div className="card flex justify-start">
          {(userRole === "Admin" || userRole === "Monitor" || userRole === "Supervisor") && (
            <>
              <button onClick={() => navigate("/dashboard/NewReport")} className="button">
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
                      setCurrentTitle(`${t("dashboard.reports.reports-of")}${propertyContext.name}`);
                    }}
                  >
                    {t("dashboard.reports.buttons.reports-per-property")}
                    <ChecklistIcon />
                  </button>
                  <button
                    className="button ml-7"
                    onClick={() => {
                      setActiveView("allReports");
                      setCurrentTitle(t("dashboard.reports.buttons.all-reports"));
                    }}
                  >
                    {t("dashboard.reports.buttons.all-reports")}
                    <ChecklistIcon />
                  </button>
                  <button
                    className="button ml-7"
                    onClick={() => {
                      setActiveView("noVerified");
                      setCurrentTitle(t("dashboard.reports.buttons.non-verified-reports"));
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
