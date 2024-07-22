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

const Reports = () => {
  const navigate = useNavigate();
  const { propertyContext, creatingReport, userContext } = useContext(UserContext);
  const [activeView, setActiveView] = useState("default");
  const { t } = useTranslation("global");
  const { activeMenu } = useStateContext();
  const toast = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const userRole = user.role.rolName;
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

  const renderActiveView = () => {
    switch (activeView) {
      case "noVerified":
        return <NoVerifiedReports />;
      case "allReports":
        return <AllReports />;
      default:
        return <PropertyReports />;
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

        <Toast ref={toast} />
        <Header title={<TypewriterText text={currentTitle} />} />

        <div className="card flex justify-start">
          {(userRole === "Admin" || userRole === "Monitor") && (
            <>
              <button onClick={() => navigate("/dashboard/NewReport")} className="button">
                {t("dashboard.reports.buttons.add-report")}
                <AiOutlinePlusCircle />
              </button>
              <span className="w-5"> </span>
              {userRole === "Admin" && (
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
