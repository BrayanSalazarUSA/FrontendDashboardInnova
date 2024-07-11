import React, {
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from "react";
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
import {
  contextMenuItems, reportsGrid, reportsGridAdmin, reportsGridMonitor} from "../data/dummy";
import { ReportsGridNoVerified } from "../tablesDashboard/Reports/ReportsGridNoVerified";
import { GridAllReports } from "../tablesDashboard/Reports/GridAllReports";
import { Header } from "../components";
import { UserContext } from "../../context/UserContext";
import "primeicons/primeicons.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getNumberOfReportsByRole } from "../helper/Reports/dataTables/getNumberOfReportsByRole";
import { getReportsNoVerified } from "../helper/getReportsNoVerified";
import { getAllReports } from "../helper/Reports/dataTables/getAllReports";
import { useStateContext } from "../../context/ContextProvider";
import CircularProgress, {
  CircularProgressProps,
} from "@mui/material/CircularProgress";
import Stomp from "stompjs";
import TableSkeleton from "../components/TableSkeleton";
import { Toast } from "primereact/toast";
import { AiOutlinePlusCircle } from "react-icons/ai";
import ChecklistIcon from "@mui/icons-material/Checklist";
import '../pages/css/Outlet/Outlet.css'
import '../pages/css/Reports/Reports.css'
import TypewriterText from "../components/Texts/TypewriterTex";

  const Reports = () => {
    const navigate = useNavigate();
    const toolbarOptions = ["Search"];
    const { propertyContext, creatingReport, userContext } =
      useContext(UserContext);
    const [reportes, setReportes] = useState([]);
    const [t, i18n] = useTranslation("global");
    const [activeView, setActiveView] = useState("default");
    const [loading, setLoading] = useState(true);

    const { activeMenu } = useStateContext();
    const toast = useRef(null);

    let user = JSON.parse(localStorage.getItem("user"));
    let userRole = user.role.rolName;
    let propertyStorage = JSON.parse(localStorage.getItem("propertySelected"));
    let idStorage = propertyStorage.id;
    let id = propertyContext.id || idStorage;
    const [currentTitle, setCurrentTitle] = useState(`${t("dashboard.reports.reports-of")}${propertyContext.name}`);

    const fetchReports = useCallback(async () => {
      let reports;
      try {
        reports = await getNumberOfReportsByRole(id, user.id, userRole);
        setReportes(reports);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los reportes:", error);
      }
    }, [id, user.id, userRole]);

    const fetchallReports = useCallback(async () => {
      let allreports;
      try {
        setLoading(true);
        allreports = await getAllReports();
        setReportes(allreports);
        setLoading(false);
      } catch (error){
        console.error("Error buscando todos los reportes", error);
      }
    }, [] )

    const handleFetchNonVerifiedReports = useCallback(async () => {
      setLoading(true)
      try {
        const nonVerifiedReports = await getReportsNoVerified();
        setReportes(nonVerifiedReports);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
      }
    }, []);

    const setActiveViewAndFetch = async (newView, fetchFunction) => {
      setActiveView(newView);
      await fetchFunction();
    };

    const refreshReports = useCallback(async () => {
      setLoading(true);
      try {
        switch (activeView) {
          case "noVerified":
            const nonVerifiedReports = await getReportsNoVerified();
            setReportes(nonVerifiedReports);
            break;
          case "allReports":
            const allReports = await getAllReports();
            setReportes(allReports);
            break;
          default:
            const reports = await getNumberOfReportsByRole(id, user.id, userRole);
            setReportes(reports);
            break;
        }
      } catch (error) {
        console.error('Error al cargar los reportes:', error);
      } finally {
        setLoading(false);
      }
    }, [activeView, id, user.id, userRole, getReportsNoVerified, getAllReports, getNumberOfReportsByRole]);

    useEffect(() => {
      console.log('Componente montado o dependencias de refreshReports cambiadas');
      refreshReports();
    }, [refreshReports]);


  //este useEffect se utiliza para recargar los reportes, apartir de el cambio del contexto de creatingReport
      useEffect(() => {
        if (!creatingReport) {
          const timer = setTimeout(() => {
            setActiveViewAndFetch("default", fetchReports);
            setCurrentTitle(`${t("dashboard.reports.reports-of")}${propertyContext.name}`);
          }, 2000); 
          return () => clearTimeout(timer); 
        }
      }, [creatingReport, fetchReports]);

    useEffect(() => {
      refreshReports();
    }, [refreshReports]);

    useEffect(() => {
      const socketUrl = process.env.REACT_APP_WEB_SOCKET_IP;// URL del WebSocket del servidor Spring Boot

      const socket = new WebSocket(socketUrl); 
      const stompClient = Stomp.over(socket);
      stompClient.connect({}, () => {
        console.log(`/topic/user/user-${user.id.toString()}`);
        stompClient.subscribe(
          `/topic/user/user-${userContext.id.toString()}`,
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
      return () => {
        toast.current = null;
      };
    }, []);


    const noVerifiedGridColumns = ReportsGridNoVerified(t, refreshReports);
    const adminGridColumns =  reportsGridAdmin(t, refreshReports);
    const allReportsColumns = GridAllReports(t, refreshReports);

    const monitorGridColumns = useMemo(() => reportsGridMonitor(t), [t]);
    const clientGridColumns = useMemo(() => reportsGrid(t), [t]);


  return (
    <div className="mx-7 bg-white rounded-3xl overflow-auto">
      <div className="background">
   {creatingReport && (
           <div className="card flex flex-col mx-auto ml-10">
           <div class="loader flex flex-col ">
            {/*  <p className="text-lg font-semibold text-[#b38808e6]">  {t("dashboard.reports.report-loading")}</p> */}
   <div class="loader-inner">
     <div class="loader-block"></div>
     <div class="loader-block"></div>
     <div class="loader-block"></div>
     <div class="loader-block"></div>
     <div class="loader-block"></div>
     <div class="loader-block"></div>
     <div class="loader-block"></div>
     <div class="loader-block"></div>
   </div>
 </div>
         </div>
      )}
      
      <Toast ref={toast} />
        <Header
          title={<TypewriterText text={currentTitle} />}

        />


      <div className="card flex justify-start ">
        {(userRole === "Admin" || userRole === "Monitor") && (
          <>
            <button
              onClick={() => navigate("/dashboard/NewReport")}
              class="button"
            >
              {t("dashboard.reports.buttons.add-report")}

              <AiOutlinePlusCircle />
            </button>
            <span className="w-5"> </span>
            {userRole === "Admin" && (
                <>
                  <button
                    className="button"
                    onClick={() => {
                      setActiveViewAndFetch("default", fetchReports);
                      setCurrentTitle(`${t("dashboard.reports.reports-of")}${propertyContext.name}`);
                    }}
                  >
                    {t("dashboard.reports.buttons.reports-per-property")}
                    <ChecklistIcon />
                  </button>

                  <button
                    className="button ml-7"
                    onClick={() => {
                      setActiveViewAndFetch("allReports", fetchallReports)
                      setCurrentTitle(`${t("dashboard.reports.buttons.all-reports")}`);
                    }}
                  >
                    {t("dashboard.reports.buttons.all-reports")}
                    <ChecklistIcon />
                  </button>

                  <button
                    className="button ml-7"
                    onClick={() => {
                      setActiveViewAndFetch("noVerified", handleFetchNonVerifiedReports);
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
      {loading ? (
        <TableSkeleton />
      ) : (
      <GridComponent
        id="gridcomp"
        key={`${activeView}-${i18n.language}`}
        dataSource={reportes}
        allowPaging
        allowSorting
        allowExcelExport
        allowPdfExport
        contextMenuItems={contextMenuItems}
        toolbar={toolbarOptions}
        allowResizing
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
              {userRole === "Admin" ? (
                activeView === "noVerified" ? (
                  noVerifiedGridColumns.map((item, index) => (
                    <ColumnDirective key={index} {...item} />
                  ))
                ) : activeView === "allReports" ? (
                  allReportsColumns.map((item, index) => (
                    <ColumnDirective key={index} {...item} />
                  ))
                ) : (
                  adminGridColumns.map((item, index) => (
                    <ColumnDirective key={index} {...item} />
                  ))
                )
              ) : userRole === "Monitor" ? (
                monitorGridColumns.map((item, index) => (
                  <ColumnDirective key={index} {...item} />
                ))
              ) : (
                clientGridColumns.map((item, index) => (
                  <ColumnDirective key={index} {...item} />
                ))
              )}
        </ColumnsDirective>
      </GridComponent>
      )}
    </div>
  );
};
export default Reports;
