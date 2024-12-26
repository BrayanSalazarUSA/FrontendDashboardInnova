import React, { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../../context/UserContext";
import ReactImageGallery from "react-image-gallery";
import { useNavigate, useParams } from "react-router-dom";
import { GiPoliceBadge } from "react-icons/gi";
import { MdCheckCircle, MdError, MdLocalPolice } from "react-icons/md";
import { GiCctvCamera } from "react-icons/gi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import JSZip from "jszip";
import CircularProgress, {
  CircularProgressProps,
} from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { Dialog } from "primereact/dialog";
import Backdrop from "@mui/material/Backdrop";
import {
  AiFillCheckCircle,
  AiFillFilePdf,
  AiOutlineNumber,
  AiOutlineTeam,
} from "react-icons/ai";
import { BiMailSend } from "react-icons/bi";

import Tooltip from "@mui/material/Tooltip";

import { Button } from "primereact/button";
import { BsBuildings, BsCalendarDate } from "react-icons/bs";
import { GoUnverified } from "react-icons/go";
import { FaLevelUpAlt, FaUser } from "react-icons/fa";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { MdEmail, MdOutlineMail } from "react-icons/md";
import { BiTimeFive } from "react-icons/bi";
import { FiUser } from "react-icons/fi";
import { editReport } from "../helper/Reports/UpdateReport/editReport";
import { getReportId } from "../helper/getReportId";
import { deleteItem } from "../helper/delete";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import postViewedUser from "../helper/postViewedUser ";
import { GridPdf } from "../tablesTemplates/Reports/GridPdf";
import ViewedsTable from "../components/Reports/ReportDetails/ViewedsTable";
import TableSkeleton from "../components/TableSkeleton";
import { exportPdfEvidences } from "../helper/ReportDetails/exportPdfEvidences";
import SendEmail from "../components/Forms/reportDetails/SendEmail";
import "../pages/css/ReportDetails/ReportDetails.css";
import { createFolderName } from "../helper/Reports/Archive/helpsers";
import { ProgressSpinner } from "primereact/progressspinner";
import { policeValidation } from "../helper/Reports/UpdateReport/policeValidationUpdate";
import { Info, PolicyRounded } from "@mui/icons-material";
import { Typography } from "@mui/material";
import PoliceValidationModal from "../components/Reports/PoliceValidationModal";

let url = `${process.env.REACT_APP_SERVER_IP}/reports`;
let noImages = [
  {
    original:
      "https://cdn4.iconfinder.com/data/icons/picture-sharing-sites/32/No_Image-512.png",
    thumbnail:
      "https://cdn4.iconfinder.com/data/icons/picture-sharing-sites/32/No_Image-512.png",
  },
];

let images = [];
let videos = [];

export const ReportDatails = () => {
  const [filesToDownload, setFilesToDownload] = useState([]);
  const [loadingevidences, setLoadingevidences] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showButton, setShowButton] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [t, i18n] = useTranslation("global");
  let dataImages = [];
  let dataVideos = [];
  const navigate = useNavigate();
  let { id } = useParams();
  const [flag, setFlag] = useState(false);

  const [sendEmailDialogVisible, setSendEmailDialogVisible] = useState(false);
  const [openValidationForm, setOpenValidationForm] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [reportDetails, setReportDetails] = useState({});
  //const {report, isLoading} = useFetchReportId(id, navigate);
  const loadInitialUser = () => {
    const userStored = localStorage.getItem("user");
    if (userStored) {
      return JSON.parse(userStored);
    }
    // Retorna un objeto inicial si no hay nada en localStorage
    return { id: null, viewed: false, role: { rolName: "" } };
  };
  const [user, setUser] = useState(loadInitialUser);

  const [loadingVideos, setLoadingVideos] = useState({}); // Estado para manejar el loading por video
  const [refresh, setRefresh] = useState(false);
  const handleDecodeWithLoader = async (video) => {
    setLoadingVideos((prev) => ({ ...prev, [video]: true })); // Activar loader para este video
    await handleDecode(video);
    setLoadingVideos((prev) => ({ ...prev, [video]: false })); // Desactivar loader
  };
  let userRole = user.role?.rolName || "Monitor";
  const videoRefs = useRef({});

  const {
    reportSaved,
    setreportSaved,
    reportFormVisible,
    setReportFormVisible,
  } = useContext(UserContext);

  useEffect(() => {
    getReportId(id, navigate).then((data) => {
      setReportDetails(data);
      setLoading(false);
      let evidences = data?.evidences?.map((evidence) => ({
        name: evidence.name,
        url: `${process.env.REACT_APP_S3_BUCKET_URL}/${evidence.path}`,
      }));
      setFilesToDownload(evidences);

      const { company, property, level, numerCase, caseType, otherSeeReport } =
        data;

      const folder = createFolderName(
        property,
        company,
        caseType,
        otherSeeReport,
        level,
        numerCase
      );

      // Actualizar el estado con el nombre de la carpeta generado
      setFolderName(folder);

      console.log("Report data:", data);
    });
  }, [reportSaved, refresh]);

  const handleDecode = async (videoUrl) => {
    setLoading(true); // Activar loading mientras se decodifica el video
    try {
      const response = await fetch(
        `${url}/convert-and-replace?videoUrl=${videoUrl}&userChannel=${user.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        // Forzar la actualización del video usando su ref
        if (videoRefs.current[videoUrl]) {
          const videoElement = videoRefs.current[videoUrl];
          videoElement.src = `${videoUrl}?t=${new Date().getTime()}`;
          videoElement.load(); // Recargar el video
        }
        setLoading(false); // Desactivar loading
      } else {
        console.error("Error al decodificar el video");
        setLoading(false); // Desactivar loading en caso de error
      }
    } catch (error) {
      console.error("Error al decodificar el video:", error);
      setLoading(false); // Desactivar loading en caso de error
    }
  };

  const [formData, setFormData] = useState({
    relatedToResidence: false,
    subjectLeftProperty: false,
    detailedDescription: false,
    subjectPlate: false,
    attachedPhoto: false,
    note: "",
    state: "",
    validatedBy: {},
    errors: {
      relatedToResidence: null, // null significa que aún no se ha validado
      detailedDescription: null,
      subjectPlate: null,
      attachedPhoto: null,
      note: null,
    },
  });

  const clearData = () => {
    setFormData({
      relatedToResidence: false,
      subjectLeftProperty: false,
      detailedDescription: false,
      subjectPlate: false,
      attachedPhoto: false,
      note: "",
      state: "",
      validatedBy: {},
      errors: {
        relatedToResidence: null,
        subjectLeftProperty: null,
        detailedDescription: null,
        subjectPlate: null,
        attachedPhoto: null,
        note: null,
      },
    });
  };

  videos = reportDetails?.evidences?.filter((img) => img.type === "video");
  images = reportDetails?.evidences?.filter((img) => img.type === "image");
  dataImages = images?.map((img) => ({
    original: `${process.env.REACT_APP_S3_BUCKET_URL}/${img?.path}`,
    thumbnail: `${process.env.REACT_APP_S3_BUCKET_URL}/${img?.path}`,
  }));
  dataVideos = videos?.map(
    (vid) => `${process.env.REACT_APP_S3_BUCKET_URL}/${vid?.path}`
  );
  const [incidentType, setIncidentType] = useState("");

  function generateToastMessage(validationData) {
    console.log("validationData");
    console.log(validationData);
    const date = new Date().toLocaleString(); // Fecha y hora actual

    // Título con el nombre y fecha de la persona que aprobó o rechazó el reporte
    let title = `${
      validationData.state === "REJECTED" ? "Rechazado" : "Aprobado"
    } por: Maria - ${date}`;

    // Comienza con el mensaje principal
    let message = `${
      validationData.state === "REJECTED"
        ? "El reporte fue rechazado debido a que no cumplió con los requerimientos de información para enviarse al departamento de policía."
        : "El reporte fue aprobado para enviarse al departamento policial."
    }`;

    // Verifica si hay una nota
    if (validationData.note && validationData.note.trim().length > 0) {
      message += `\n\nNota: ${validationData.note}`;
    } else {
      message += "\n\nNo se proporcionó una nota explicativa.";
    }

    // Filtra los campos que son falsos y agréguelos al mensaje
    const falseFields = [];
    if (!validationData.relatedToResidence)
      falseFields.push("Relacionado con alguna residencia");
    if (!validationData.detailedDescription)
      falseFields.push("Descripción detallada del sujeto");
    if (!validationData.subjectPlate)
      falseFields.push("Información sobre la placa");
    if (!validationData.attachedPhoto)
      falseFields.push("Foto adjunta del sujeto");

    if (falseFields.length > 0) {
      message +=
        "\n\nCampos faltantes o incorrectos:\n" +
        falseFields.map((field) => `${field}`).join("\n");
    }
    console.log(title, message, falseFields);
    return { title, message, falseFields };
  }

  useEffect(() => {
    if (!reportDetails || !reportDetails.caseType) return;

    const incidentInCurrentLanguage =
      i18n.language === "en"
        ? reportDetails.caseType.incident
        : reportDetails.caseType.translate;
    setIncidentType(incidentInCurrentLanguage);

    if (reportDetails.policeValidation) {
      const { title, message, falseFields } = generateToastMessage(
        reportDetails.policeValidation
      );

      // Si el reporte fue aprobado
      const toastIcon =
        reportDetails.policeValidation.state === "REJECTED" ? (
          <MdError className="text-red-600" />
        ) : (
          <MdCheckCircle className="text-green-600" />
        );
    }
  }, [reportDetails, i18n.language]);

  useEffect(() => {
    if (userRole === "Client" && user.id && id) {
      console.log("Condiciones cumplidas para marcar como visto");
      postViewedUser(user.id, id).catch((error) => {
        console.error("Error al marcar el reporte como visto:", error);
      });
    }
  }, [userRole, user.id, id]);

  const handleDownload = async () => {
    setShowButton(false); // Ocultar el botón al comenzar la descarga
    setLoadingevidences(true); // Activar el loader

    const zip = new JSZip();

    try {
      // Generación del pdf para agregarlo a la descarga
      const pdfBlob = await exportPdfEvidences(reportDetails);
      const { caseType, property, level, numerCase, otherSeeReport } =
        reportDetails;

      let pdfName = `#${numerCase} - Level ${level} - (${caseType.incident}${
        otherSeeReport ? " _ " + otherSeeReport : ""
      }) - ${property.name}.pdf`;

      zip.file(pdfName, pdfBlob);

      // Agregar evidencias al ZIP
      const totalFiles = filesToDownload.length;
      let filesProcessed = 0;

      await Promise.all(
        filesToDownload.map(async (file) => {
          const response = await fetch(file.url, {
            method: "GET",
            mode: "cors",
            cache: "no-store",
          });
          const data = await response.arrayBuffer(); // Obtener el cuerpo de la respuesta como un ArrayBuffer
          zip.file(file.name, data);

          // Incrementar el contador de archivos procesados y calcular el progreso
          filesProcessed++;
          const currentProgress = Math.round(
            (filesProcessed / totalFiles) * 100
          );
          setProgress(currentProgress);
        })
      );

      // Generar el archivo ZIP y descargar
      const content = await zip.generateAsync({ type: "blob" });
      const downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(content);
      downloadLink.download = folderName; // Nombre del archivo ZIP y la carpeta
      downloadLink.click();
    } catch (error) {
      console.error(
        "Error durante la generación o descarga del archivo ZIP:",
        error
      );
      Swal.fire("Error", "Failed to generate or download ZIP file.", "error");
      setLoadingevidences(false);
      setShowButton(true);
    } finally {
      setLoadingevidences(false); // Desactivar el loader una vez que la descarga esté completa
      setProgress(0); // Restablecer el progreso
      setShowButton(true); // Mostrar el botón nuevamente
    }
  };

  function validatePoliceReport(report) {
    // Validar los campos requeridos
    const newErrors = {
      relatedToResidence: report.relatedToResidence,
      subjectLeftProperty: report.subjectLeftProperty,
      detailedDescription: report.detailedDescription,
      subjectPlate: report.subjectPlate,
      attachedPhoto: report.attachedPhoto,
    };

    // Verificar si algún campo es falso (es decir, no marcado)
    const isAnyFieldFalse = Object.values(newErrors).includes(false);
    console.log(isAnyFieldFalse, "isAnyFieldFalse");
    // Validar si se requiere una nota cuando alguno de los campos es falso
    const isNoteRequired = isAnyFieldFalse
      ? report.note.trim().length === 0 // La nota es requerida si está vacía
      : false; // No es requerida si todos los campos son verdaderos

    console.log(isNoteRequired, "isNoteRequired");
    // Si algún campo es falso y no se ingresó una nota, marcar error en la nota
    newErrors.note = isAnyFieldFalse && isNoteRequired;
    console.log(newErrors.note, "newErrors.note");
    console.log(newErrors);
    // Actualizamos el estado con los errores encontrados
    setFormData({
      ...formData,
      errors: newErrors,
    });
    console.log(formData);

    // Verificar si todos los campos obligatorios están presentes
    if (
      report.relatedToResidence &&
      report.detailedDescription &&
      report.subjectPlate &&
      report.attachedPhoto
    ) {
      console.log("Todos los campos son verdaderos");
      return true; // La validación pasó, podemos proceder a enviar el reporte
    } else {
      // Si alguna condición falla, pero se agregó una nota justificativa
      if (report.note && report.note.trim().length > 0) {
        console.log("Falló algún campo pero se agregó una nota");
        return true; // La nota fue agregada, podemos continuar
      } else {
        console.log("Falló algún campo y no se agregó una nota");
        return false; // No se agregó nota justificativa, no se puede enviar el reporte
      }
    }
  }

  const isPoliceOnSceneAndLevel4 = (report) => {
    if (report?.policeFirstResponderScene === "Yes" && report.level === "4" && report?.policeValidation?.state==="APPROVED") {
      return true;
    } else {
      return false;
    }
  };

  const handleOpenEmailDialog = (event) => {
    event.stopPropagation();
    if (isPoliceOnSceneAndLevel4(reportDetails)) {
      console.log('isPoliceOnSceneAndLevel4(reportDetails)')
      console.log(isPoliceOnSceneAndLevel4(reportDetails))
      setSendEmailDialogVisible(true);
    } else {
      setOpenValidationForm(true);
    }
    //setSendEmailDialogVisible(true);
  };

  const handleCloseEmailDialog = () => {
    setSendEmailDialogVisible((prev) => !prev);
  };

  const updateVerificationStatus = (newStatus) => {
    setReportDetails((prevDetails) => ({
      ...prevDetails,
      verified: newStatus,
    }));
  };

  const translations = {
    Yes: t(
      "dashboard.reports.new-report.List-policeFirstResponderNotified.yes"
    ),
    No: t("dashboard.reports.new-report.List-policeFirstResponderNotified.no"),
    "N/A": t(
      "dashboard.reports.new-report.List-policeFirstResponderNotified.n/a"
    ),
    "Fiat Security": t(
      "dashboard.reports.new-report.List-policeFirstResponderNotified.fiat-security"
    ),
    Security: t(
      "dashboard.reports.new-report.List-policeFirstResponderNotified.security"
    ),
    Police: t(
      "dashboard.reports.new-report.List-policeFirstResponderNotified.police"
    ),
    Firemen: t(
      "dashboard.reports.new-report.List-policeFirstResponderNotified.firemen"
    ),
    Ambulance: t(
      "dashboard.reports.new-report.List-policeFirstResponderNotified.ambulance"
    ),
  };

  function getTranslatedValue(value) {
    return translations[value] || value;
  }

  // Suponiendo que policeFirstResponderScene contiene el valor actual
  const selectedValue = reportDetails?.policeFirstResponderScene;

  // Obtén la traducción correspondiente
  const translatedValue = getTranslatedValue(selectedValue);

  const isOtherSeeReport =
    reportDetails.caseType?.id === 10 ||
    reportDetails.caseType?.incident === "Other See Report";
  const incidentToUse = isOtherSeeReport
    ? reportDetails.otherSeeReport
    : reportDetails.caseType?.incident;
  // Maneja el cambio de los valores en los inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    console.log(name, value, type, checked);
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleChangeNote = (e) => {
    const { name, value, type, checked } = e.target;
    console.log(name, value, type, checked);
    setFormData({
      ...formData,
      note: value,
    });
  };

  // Maneja el envío del formulario para aprobar o rechazar
  const handleSubmitValidation = async (e, state) => {
    e.preventDefault();

    // Cierra el modal y activa el loader
    setOpenValidationForm(false);
    setLoading(true);

    try {
      // Realiza la validación según el estado
      await policeValidation(reportDetails.id, {
        ...formData,
        state,
        validatedBy: user,
      });

      // Refresca la vista y muestra notificación basada en el estado
      if (state === "APPROVED") {
        toast.success(
          "El reporte ha sido aprobado correctamente y se notificará a la policía.",
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
        setSendEmailDialogVisible(true)
      } else if (state === "REJECTED") {
        toast.error(
          "El reporte ha sido devuelto debido a que no cumple con las condiciones necesarias.",
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
      }
    } catch (error) {
      // Manejo de errores (opcional)
      toast.error("Ocurrió un error al procesar la solicitud.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      // Detiene el loader y refresca la vista
      setLoading(false);
      setRefresh((prev) => !prev);
      clearData();
    }
  };

  // Controla las acciones para aprobar
  const handleApprove = (e) => handleSubmitValidation(e, "APPROVED");

  // Controla las acciones para rechazar
  const handleReject = (e) => handleSubmitValidation(e, "REJECTED");

  return (
    <div className="mx-20 md:m-10  md:p-0 bg-white rounded-3xl">
     
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
        open={loading}
      >
        <CircularProgress color="inherit" sx={{ marginBottom: 2 }} />
        <Box>
          <Typography
            variant="h6"
            component="div"
            sx={{ fontWeight: 600, fontSize: 16 }}
          >
            Enviando correos electrónicos de aviso de reporte rechazado...
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "#cfcfcf", textAlign: "center" }}
          >
            Esto puede tardar unos momentos, por favor espere.
          </Typography>
        </Box>
      </Backdrop>
      <div className="w-full flex justify-end">
        <div className="card"></div>
        <div className="col-xs-12 col-sm-12 col-lg-6 col-md-6"></div>
      </div>{" "}
      <div>
        <div className="px-4 py-3 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-3">
          <div className="max-w-xl  md:mx-auto sm:text-center lg:max-w-2xl">
            <div className="">
              <h6 className="inline-block px-3 py-px mb-4 text-xs font-semibold tracking-wider text-gray-700 uppercase rounded-full bg-teal-accent-400">
                INNOVA MONITORING
              </h6>
            </div>
            <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold leading-none tracking-tight text-yellow-600 sm:text-4xl md:mx-auto">
              <span className="relative inline-block">
                <svg
                  viewBox="0 0 52 24"
                  fill="currentColor"
                  className="absolute top-0 left-0 z-0 hidden w-32 -mt-8 -ml-20 text-blue-gray-100 lg:w-32 lg:-ml-28 lg:-mt-10 sm:block"
                >
                  <defs>
                    <pattern
                      id="07690130-d013-42bc-83f4-90de7ac68f76"
                      x="0"
                      y="0"
                      width=".135"
                      height=".30"
                    >
                      <circle cx="1" cy="1" r=".7" />
                    </pattern>
                  </defs>
                  <rect
                    fill="url(#07690130-d013-42bc-83f4-90de7ac68f76)"
                    width="52"
                    height="24"
                  />
                </svg>
                <span className="relative">
                  {t("dashboard.reports.case-details.incident-report")} #
                  {reportDetails?.numerCase}
                </span>
              </span>
            </h2>
            <p className="text-base text-gray-700 md:text-lg"></p>
          </div>
          <ToastContainer className="mt-5" />
          <div className="grid max-w-screen-lg mx-auto space-y-2 lg:grid-cols-2 lg:space-y-0 lg:divide-x ">
            <div className="space-y-2 sm:px-4">
              <div className="flex max-w-full border-b-1">
                <div className=" mr-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50">
                    <BsBuildings className="text-yellow-600 w-5 h-6"></BsBuildings>
                  </div>
                </div>
                <div className="flex items-center max-w-full ">
                  <h6 className=" text-xl font-bold leading-5">
                    {t("dashboard.reports.case-details.property")}
                  </h6>
                  <p className="text-lg text-gray-900 ml-3">
                    {reportDetails?.property?.name}
                  </p>
                </div>
              </div>
              <div className="flex max-w-full ">
                <div className=" mr-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50">
                    <FiUser className="text-yellow-600 w-5 h-6"></FiUser>
                  </div>
                </div>
                <div className="flex items-center w-full border-b-1">
                  <p className=" text-lg font-bold ">
                    {t("dashboard.reports.case-details.name")}
                  </p>
                  <p className="text-lg text-gray-900 ml-3">
                    {reportDetails?.createdBy?.name}
                  </p>
                </div>
              </div>
              {reportDetails.contributedBy && (
                <div className="flex max-w-full ">
                  <div className=" mr-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50">
                      <AiOutlineTeam className="text-yellow-600 w-5 h-6"></AiOutlineTeam>
                    </div>
                  </div>
                  <div className="flex items-center w-full border-b-1">
                    <p className=" text-lg font-bold ">Contributed By:</p>
                    <p className="text-lg text-gray-900 ml-3">
                      {reportDetails?.contributedBy?.name}
                    </p>
                  </div>
                </div>
              )}
              <div className="flex max-w-full ">
                <div className=" mr-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50">
                    <HiOutlineDocumentReport className="text-yellow-600 w-5 h-6"></HiOutlineDocumentReport>
                  </div>
                </div>
                <div className="flex items-center w-full border-b-1">
                  <p className=" text-lg font-bold ">
                    {t("dashboard.reports.case-details.incident")}
                  </p>
                  <p className="text-lg text-gray-900 ml-3">{incidentType}</p>
                </div>
              </div>
              <div className="flex max-w-full ">
                <div className=" mr-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50">
                    <FaLevelUpAlt className="text-yellow-600 w-5 h-6"></FaLevelUpAlt>
                  </div>
                </div>
                <div className="flex items-center w-full border-b-1">
                  <p className=" text-lg font-bold ">
                    {t("dashboard.reports.case-details.level")}
                  </p>
                  <p className="text-lg text-gray-900 ml-3">
                    {reportDetails?.level}
                  </p>
                </div>
              </div>
              <div className="flex max-w-full ">
                <div className=" mr-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50">
                    <MdLocalPolice className="text-yellow-600 w-5 h-6"></MdLocalPolice>
                  </div>
                </div>
                <div className="flex items-center w-full border-b-1">
                  <p className=" text-lg font-bold ">
                    {t("dashboard.reports.case-details.security-guards-scene")}
                  </p>
                  <p className="text-lg text-gray-900 ml-3">
                    {reportDetails?.securityGuardsScene ? (
                      <p className="text-teal-600">
                        {t("dashboard.reports.case-details.yes")}
                      </p>
                    ) : (
                      <p className="text-red-700">
                        {t("dashboard.reports.case-details.no")}
                      </p>
                    )}
                  </p>
                </div>
              </div>{" "}
              <div className="flex max-w-full ">
                <div className=" mr-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50">
                    <GiPoliceBadge className="text-yellow-600 w-5 h-6"></GiPoliceBadge>
                  </div>
                </div>
                <div className="flex items-center w-full border-b-1">
                  <p className=" text-lg font-bold ">
                    {t(
                      "dashboard.reports.case-details.security-guards-notified"
                    )}
                  </p>
                  <p className="text-lg text-gray-900 ml-3">
                    {reportDetails?.securityGuardsNotified ? (
                      <p className="text-teal-600">
                        {t("dashboard.reports.case-details.yes")}
                      </p>
                    ) : (
                      <p className="text-red-700">
                        {t("dashboard.reports.case-details.no")}
                      </p>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex max-w-full ">
                <div className=" mr-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50">
                    <FaUser className="text-yellow-600 w-5 h-6"></FaUser>
                  </div>
                </div>
                <div className="flex items-center w-full border-b-1">
                  <p className=" text-lg font-bold ">
                    {t(
                      "dashboard.reports.case-details.form-notification-client"
                    )}
                  </p>
                  <p className="text-lg text-gray-900 ml-3">
                    {reportDetails?.formNotificationClient}
                  </p>
                </div>
              </div>
              <div className="flex max-w-full ">
                <div className=" mr-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50">
                    <GiCctvCamera className="text-yellow-600 w-5 h-6"></GiCctvCamera>
                  </div>
                </div>
                <div className="flex items-center w-full border-b-1">
                  <p className=" text-lg font-bold ">
                    {t("dashboard.reports.case-details.observed-via-cameras")}
                  </p>
                  <p className="text-lg text-gray-900 ml-3">
                    {reportDetails?.observedViaCameras ? (
                      <p className="text-teal-600">
                        {t("dashboard.reports.case-details.yes")}
                      </p>
                    ) : (
                      <p className="text-red-700">
                        {t("dashboard.reports.case-details.no")}
                      </p>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex max-w-full ">
                <div className=" mr-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50">
                    <GiCctvCamera className="text-yellow-600 w-5 h-6"></GiCctvCamera>
                  </div>
                </div>
                <div className="flex items-center w-full border-b-1">
                  <p className=" text-lg font-bold ">
                    {t(
                      "dashboard.reports.case-details.list-malfuncioning-cameras"
                    )}
                  </p>
                  <p className="text-lg text-gray-900 ml-3">
                    {reportDetails?.listMalfunctioningCameras}
                  </p>
                </div>
              </div>
              <div className="flex max-w-full ">
                <div className=" mr-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50">
                    <AiFillCheckCircle className="text-yellow-600 w-5 h-6"></AiFillCheckCircle>
                  </div>
                </div>
                <div className="flex items-center w-full border-b-1">
                  <p className=" text-lg font-bold ">
                    {t("dashboard.reports.case-details.cameras-functioning")}
                  </p>
                  <p className="text-lg text-gray-900 ml-3">
                    {reportDetails?.camerasFunctioning ? (
                      <p className="text-teal-600">
                        {t("dashboard.reports.case-details.yes")}
                      </p>
                    ) : (
                      <p className="text-red-700">
                        {t("dashboard.reports.case-details.no")}
                      </p>
                    )}
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-2 sm:px-4">
              <div className="flex max-w-full ">
                <div className=" mr-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50">
                    <BsCalendarDate className="text-yellow-600 w-5 h-6"></BsCalendarDate>
                  </div>
                </div>
                <div className="flex items-center w-full border-b-1">
                  <p className=" text-lg font-bold ">
                    {t("dashboard.reports.case-details.date-of-report")}
                  </p>
                  <p className="text-lg text-gray-900 ml-3">
                    {reportDetails?.dateOfReport}
                  </p>
                </div>
              </div>
              <div className="flex max-w-full ">
                <div className=" mr-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50">
                    <BiTimeFive className="text-yellow-600 w-5 h-6"></BiTimeFive>
                  </div>
                </div>
                <div className="flex items-center w-full border-b-1">
                  <p className=" text-lg font-bold ">
                    {t("dashboard.reports.case-details.incident-start-time")}
                  </p>
                  <p className="text-lg text-gray-900 ml-3">
                    {reportDetails?.incidentStartTime}
                  </p>
                </div>
              </div>

              <div className="flex max-w-full">
                <div className=" mr-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50">
                    <BiTimeFive className="text-yellow-600 w-5 h-6"></BiTimeFive>
                  </div>
                </div>

                <div className="flex items-center w-full border-b-1">
                  <p className=" text-lg font-bold ">
                    {t("dashboard.reports.case-details.incident-end-time")}
                  </p>
                  <p className="text-lg text-gray-900 ml-3">
                    {reportDetails?.incidentEndTime ||
                      t("dashboard.reports.case-details.persist")}
                  </p>
                </div>
              </div>

              <div className="flex max-w-full ">
                <div className=" mr-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50">
                    <BiTimeFive className="text-yellow-600 w-5 h-6"></BiTimeFive>
                  </div>
                </div>
                <div className="flex items-center w-full border-b-1">
                  <p className=" text-lg font-bold ">
                    {t("dashboard.reports.case-details.time-of-report")}
                  </p>
                  <a className="text-lg text-teal-600 ml-3">
                    {reportDetails?.timeOfReport}
                  </a>
                </div>
              </div>
              <div className="flex max-w-full ">
                <div className=" mr-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50">
                    <AiFillFilePdf className="text-yellow-600 w-5 h-6"></AiFillFilePdf>
                  </div>
                </div>
                <div className="flex items-center w-full border-b-1">
                  <p className=" text-lg font-bold mr-5">
                    {" "}
                    {t("dashboard.reports.case-details.incident-pdf")}:{" "}
                  </p>
                  <GridPdf {...reportDetails} className="ml-20">
                    <AiFillFilePdf />
                  </GridPdf>
                </div>
              </div>
              <div className="flex max-w-full ">
                <div className=" mr-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50">
                    <AiOutlineNumber className="text-yellow-600 w-5 h-6"></AiOutlineNumber>
                  </div>
                </div>
                <div className="flex items-center w-full border-b-1">
                  <p className=" text-lg font-bold ">
                    {t("dashboard.reports.case-details.numer-case")}
                  </p>
                  <p className="text-lg text-gray-900 ml-3">
                    {reportDetails?.numerCase}
                  </p>
                </div>
              </div>

              <div className="flex max-w-full ">
                <div className=" mr-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50">
                    <GoUnverified className="text-yellow-600 w-5 h-6"></GoUnverified>
                  </div>
                </div>
                <div className="flex items-center w-full border-b-1">
                  <p className=" text-lg font-bold ">
                    {t("dashboard.reports.case-details.verified")}
                  </p>
                  <p className="text-lg text-gray-900 ml-3">
                    {reportDetails?.verified ? (
                      <p className="text-teal-600">
                        {t("dashboard.reports.case-details.yes")}
                      </p>
                    ) : (
                      <p className="text-red-700">
                        {t("dashboard.reports.case-details.no")}
                      </p>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex max-w-full ">
                <div className=" mr-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50">
                    <MdEmail className="text-yellow-600 w-5 h-6"></MdEmail>
                  </div>
                </div>
                <div className="flex items-center w-full border-b-1">
                  <p className=" text-lg font-bold ">
                    {t("dashboard.reports.case-details.emailed-report")}
                  </p>
                  <p className="text-lg text-gray-900 ml-3">
                    {reportDetails?.emailedReport}
                  </p>
                </div>
              </div>
              <div className="flex max-w-full ">
                <div className=" mr-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50">
                    <MdLocalPolice className="text-yellow-600 w-5 h-6"></MdLocalPolice>
                  </div>
                </div>
                <div className="flex items-center w-full border-b-1">
                  <p className=" text-lg font-bold ">
                    {t("dashboard.reports.case-details.police-notified")}
                  </p>
                  <p className="text-lg text-gray-900 ml-3">
                    {reportDetails?.policeFirstResponderNotified ? (
                      <p className="text-teal-600">
                        {t("dashboard.reports.case-details.yes")}
                      </p>
                    ) : (
                      <p className="text-red-700">
                        {t("dashboard.reports.case-details.no")}
                      </p>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex max-w-full ">
                <div className=" mr-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50">
                    <AiFillCheckCircle className="text-yellow-600 w-5 h-6"></AiFillCheckCircle>
                  </div>
                </div>
                <div className="flex items-center w-full border-b-1">
                  <p className=" text-lg font-bold ">
                    {t(
                      "dashboard.reports.case-details.police-first-responder-notified"
                    )}
                  </p>
                  <p className="text-lg text-gray-900 ml-3">
                    <p>{translatedValue}</p>
                  </p>
                </div>
              </div>

              {reportDetails.policeNumerCase && (
                <div className="flex max-w-full">
                  <div className="mr-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50">
                      <AiFillCheckCircle className="text-yellow-600 w-5 h-6"></AiFillCheckCircle>
                    </div>
                  </div>
                  <div className="flex items-center w-full border-b-1">
                    <p className="text-lg font-bold">
                      {t("dashboard.reports.case-details.police-numer-case")}
                    </p>
                    <p className="text-lg text-gray-900 ml-3">
                      <p className="text-gray-800">
                        {reportDetails.policeNumerCase}
                      </p>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {userRole === "Admin" && (
          <div className="w-full flex justify-start m-6 ml-20">
            <button onClick={handleOpenEmailDialog} class="button">
              {t("dashboard.reports.case-details.send-and-verfied")}
              <BiMailSend className="text-2xl" />
            </button>
            {reportDetails.policeValidation && (
              <PoliceValidationModal reportDetails={reportDetails} />
            )}
            <Dialog
              visible={sendEmailDialogVisible}
              modal
              dismissableMask
              onHide={handleCloseEmailDialog}
              className="dialog-fullscreen"
              contentStyle={{
                borderRadius: "12px",
                backgroundColor: "#2E2E2E",
              }}
            >
              {reportDetails?.caseType && (
                <SendEmail
                  incidentType={incidentType}
                  incidentLevel={reportDetails.level}
                  caseNumber={reportDetails.numerCase}
                  incidentEnglish={incidentToUse}
                  incidentDate={reportDetails.incidentDate}
                  incidentStartTime={reportDetails.incidentStartTime}
                  images={dataImages}
                  videos={dataVideos}
                  propertyName={reportDetails.property.name}
                  propertyId={reportDetails.property.id}
                  reportId={reportDetails.id}
                  reportVerified={reportDetails.verified}
                  updateVerification={updateVerificationStatus}
                  onHide={handleCloseEmailDialog}
                  pdf={reportDetails.pdf}
                  otherSeeReport={reportDetails.otherSeeReport}
                />
              )}
            </Dialog>
          </div>
        )}
      </div>
      <Dialog
        visible={openValidationForm}
        modal
        dismissableMask
        onHide={() => setOpenValidationForm(false)}
        /* contentStyle={{
          backgroundColor:"lightgray"
        }} */
        header={
          <h1 className="text-2xl font-bold  flex items-center space-x-2">
            {/* Ícono de policía (Material UI) */}
            <PolicyRounded className="text-red-600" style={{ fontSize: 32 }} />
            <span>Formulario de Reporte Policial</span>
          </h1>
        }
      >
        <div class="h-auto bg-white pt-6 px-4 flex flex-col justify-center ">
          <div class="relative py-3 px-4 sm:max-w-xl sm:mx-auto">
            <div class="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
            <div class="relative bg-white sm:rounded-3xl px-4 sm:pt-10">
              <div className="w-full mx-auto h-full p-3  rounded-lg shadow-2xl">
                <form className="space-y-3">
                  {/* Relacionado con alguna residencia */}
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="relatedToResidence"
                      className={`block text-gray-900 text-lg font-semibold mb-2 relative group ${
                        formData.errors.relatedToResidence === false
                          ? "text-red-600"
                          : ""
                      }`}
                    >
                      <span className="flex items-center">
                        Relacionado con alguna residencia
                        <Tooltip
                          title="Este campo es para agregar comentarios o una explicación adicional sobre el reporte."
                          arrow
                          placement="top" // Define la posición del tooltip (puede ser "top", "bottom", "left", "right")
                        >
                          <Info
                            style={{ fontSize: 20 }}
                            className="ml-2 text-gray-400"
                          />
                        </Tooltip>
                      </span>
                      <span
                        className={`absolute bottom-0 left-0 w-full h-1 ${
                          formData.errors.relatedToResidence
                            ? "bg-blue-500"
                            : "bg-red-600"
                        } transform scale-x-0 origin-left transition-transform duration-300 group-focus-within:scale-x-100`}
                      ></span>
                    </label>
                    <input
                      type="checkbox"
                      id="relatedToResidence"
                      name="relatedToResidence"
                      checked={formData.relatedToResidence}
                      onChange={handleChange}
                      className={`w-6 h-6 bg-white border-2 ${
                        formData.errors.relatedToResidence
                          ? "border-red-600"
                          : "border-gray-300"
                      } rounded-md transition-colors duration-300 hover:bg-blue-100 focus:ring-2 focus:ring-blue-400`}
                    />
                  </div>

                  {/* El sujeto salió o no de la propiedad */}
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="subjectLeftProperty"
                      className={`text-gray-900 text-lg font-medium ${
                        formData.errors.subjectLeftProperty === false
                          ? "text-red-600"
                          : ""
                      }`}
                    >
                      El sujeto salió de la propiedad
                      <Tooltip
                        title="Este campo es para agregar comentarios o una explicación adicional sobre el reporte."
                        arrow
                        placement="top" // Define la posición del tooltip (puede ser "top", "bottom", "left", "right")
                      >
                        <Info
                          style={{ fontSize: 20 }}
                          className="ml-2 text-gray-400"
                        />
                      </Tooltip>
                    </label>
                    <input
                      type="checkbox"
                      id="subjectLeftProperty"
                      name="subjectLeftProperty"
                      checked={formData.subjectLeftProperty}
                      onChange={handleChange}
                      className={`w-6 h-6 bg-white border-2 ${
                        formData.errors.subjectLeftProperty
                          ? "border-red-600"
                          : "border-gray-300"
                      } rounded-md transition-colors duration-300 hover:bg-blue-100 focus:ring-2 focus:ring-blue-400`}
                    />
                  </div>

                  {/* Información sobre la placa */}
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="subjectPlate"
                      className={`text-gray-900 text-lg font-medium ${
                        formData.errors.subjectPlate === false
                          ? "text-red-600"
                          : ""
                      }`}
                    >
                      Información sobre la placa
                      <Tooltip
                        title="Este campo es para agregar comentarios o una explicación adicional sobre el reporte."
                        arrow
                        placement="top" // Define la posición del tooltip (puede ser "top", "bottom", "left", "right")
                      >
                        <Info
                          style={{ fontSize: 20 }}
                          className="ml-2 text-gray-400"
                        />
                      </Tooltip>
                    </label>
                    <input
                      type="checkbox"
                      id="subjectPlate"
                      name="subjectPlate"
                      checked={formData.subjectPlate}
                      onChange={handleChange}
                      className={`w-6 h-6 bg-white border-2 ${
                        formData.errors.subjectPlate
                          ? "border-red-600"
                          : "border-gray-300"
                      } rounded-md transition-colors duration-300 hover:bg-blue-100 focus:ring-2 focus:ring-blue-400`}
                    />
                  </div>

                  {/* Foto adjunta del sujeto */}
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="attachedPhoto"
                      className={`text-gray-900 text-lg font-medium ${
                        formData.errors.attachedPhoto === false
                          ? "text-red-600"
                          : ""
                      }`}
                    >
                      Foto adjunta del sujeto
                      <Tooltip
                        title="Este campo es para agregar comentarios o una explicación adicional sobre el reporte."
                        arrow
                        placement="top" // Define la posición del tooltip (puede ser "top", "bottom", "left", "right")
                      >
                        <Info
                          style={{ fontSize: 20 }}
                          className="ml-2 text-gray-400"
                        />
                      </Tooltip>
                    </label>
                    <input
                      type="checkbox"
                      id="attachedPhoto"
                      name="attachedPhoto"
                      checked={formData.attachedPhoto}
                      onChange={handleChange}
                      className={`w-6 h-6 bg-white border-2 ${
                        formData.errors.attachedPhoto
                          ? "border-red-600"
                          : "border-gray-300"
                      } rounded-md transition-colors duration-300 hover:bg-blue-100 focus:ring-2 focus:ring-blue-400`}
                    />
                  </div>

                  {/* Descripción detallada del sujeto */}
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="detailedDescription"
                      className={`text-gray-900 text-lg font-medium ${
                        formData.errors.detailedDescription === false
                          ? "text-red-600"
                          : ""
                      }`}
                    >
                      Descripción detallada del sujeto
                      <Tooltip
                        title="Este campo es para agregar comentarios o una explicación adicional sobre el reporte."
                        arrow
                        placement="top" // Define la posición del tooltip (puede ser "top", "bottom", "left", "right")
                      >
                        <Info
                          style={{ fontSize: 20 }}
                          className="ml-2 text-gray-400"
                        />
                      </Tooltip>
                    </label>
                    <input
                      type="checkbox"
                      id="detailedDescription"
                      name="detailedDescription"
                      checked={formData.detailedDescription}
                      onChange={handleChange}
                      className={`w-6 h-6 bg-white border-2 ${
                        formData.errors.detailedDescription
                          ? "border-red-600"
                          : "border-gray-300"
                      } rounded-md transition-colors duration-300 hover:bg-blue-100 focus:ring-2 focus:ring-blue-400`}
                    />
                  </div>

                  {/* Comentarios */}
                  <div className="flex flex-col">
                    <label
                      htmlFor="note"
                      className={`text-gray-900 text-lg font-medium ${
                        formData.errors.note === true ? "text-red-600" : ""
                      }`}
                    >
                      Comentarios
                      <Tooltip
                        title="Este campo es para agregar comentarios o una explicación adicional sobre el reporte."
                        arrow
                        placement="top" // Define la posición del tooltip (puede ser "top", "bottom", "left", "right")
                      >
                        <Info
                          style={{ fontSize: 20 }}
                          className="ml-2 text-gray-400"
                        />
                      </Tooltip>
                    </label>
                    <textarea
                      id="note"
                      name="note"
                      value={formData.note}
                      onChange={handleChangeNote}
                      placeholder="Agregue una nota donde incluya detalles del incidente"
                      className={`w-full p-4 mt-2 text-gray-900 bg-white border-2 ${
                        formData.errors.note
                          ? "border-red-600"
                          : "border-gray-300"
                      } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 ease-in-out`}
                    />
                    {formData.errors.note && (
                      <p className="text-red-600 text-sm">
                        Debe agregar una justificación en caso de no completar
                        los campos requeridos.
                      </p>
                    )}
                  </div>

                  {/* Botón de envío */}
                  <div className="flex justify-center">
                    <button
                      type="submit"
                      className="bg-blue-500 text-white py-3 mr-3 px-8 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300"
                      onClick={handleApprove}
                    >
                      Aprobar Reporte
                    </button>
                    <button
                      type="submit"
                      className="bg-red-800 text-white py-3 px-8 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300"
                      onClick={handleReject}
                    >
                      Devolver Reporte
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
      <div class="px-4 py-3 mb-15 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-3">
        <h2 class="bg-[#B78607] text-white p-3 pb-5 mb-2 rounded-t-lg">
          Incident Description
        </h2>
        <div class="p-2 bg-gray-50 rounded-b-lg px-5 py-8 relative">
          <p>{reportDetails.reportDetails || " "}</p>
        </div>
      </div>
      <div className="max-w-xl mb-10 md:mx-auto sm:text-center lg:max-w-2xl md:mb-12">
        <div>
          <p className="inline-block px-3 py-px mb-4 text-xs font-semibold tracking-wider text-teal-900 uppercase rounded-full bg-teal-accent-400">
            INNOVA MONITORING
          </p>
        </div>
        <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold leading-none tracking-tight text-yellow-600 sm:text-4xl md:mx-auto">
          <span className="relative inline-block">
            <svg
              viewBox="0 0 52 24"
              fill="currentColor"
              className="absolute top-0 left-0 z-0 hidden w-32 -mt-8 -ml-20 text-blue-gray-100 lg:w-32 lg:-ml-28 lg:-mt-10 sm:block"
            >
              <defs>
                <pattern
                  id="07690130-d013-42bc-83f4-90de7ac68f76"
                  x="0"
                  y="0"
                  width=".135"
                  height=".30"
                >
                  <circle cx="1" cy="1" r=".7" />
                </pattern>
              </defs>
              <rect
                fill="url(#07690130-d013-42bc-83f4-90de7ac68f76)"
                width="52"
                height="24"
              />
            </svg>
            <span className="relative">
              <p className=" text-yellow-600">
                {t("dashboard.reports.case-details.video-gallery")}
              </p>{" "}
            </span>
          </span>
        </h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {dataVideos?.map((video, index) => (
          <div
            key={index}
            className="relative flex flex-col items-center w-auto"
            style={{ position: "relative" }}
          >
            <div style={{ position: "relative" }}>
              <video
                controls
                width="500"
                ref={(el) => (videoRefs.current[video] = el)} // Guardar referencia del video
              >
                <source src={video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {/* Botón de decodificación con icono en la esquina superior derecha */}
              <button
                className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded shadow-lg flex items-center"
                style={{ zIndex: 10 }}
                onClick={() => handleDecodeWithLoader(video)}
                disabled={loadingVideos[video]} // Deshabilitar si está cargando
              >
                <i className="pi pi-cog mr-1"></i>{" "}
                {/* Ícono de configuración */}
              </button>
            </div>

            {/* Loader en caso de que esté cargando */}
            {loadingVideos[video] && (
              <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50 rounded">
                <ProgressSpinner style={{ width: "50px", height: "50px" }} />
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="max-w-xl my-14 md:mx-auto sm:text-center lg:max-w-2xl md:mb-12">
        <div>
          <p className="inline-block px-3 py-px mb-4 text-xs font-semibold tracking-wider text-gray-600 uppercase rounded-full bg-teal-accent-400">
            INNOVA MONITORING
          </p>
        </div>
        <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold leading-none tracking-tight text-yellow-600 sm:text-4xl md:mx-auto">
          <span className="relative inline-block">
            <svg
              viewBox="0 0 52 24"
              fill="currentColor"
              className="absolute top-0 left-0 z-0 hidden w-32 -mt-8 -ml-20 text-blue-gray-100 lg:w-32 lg:-ml-28 lg:-mt-10 sm:block"
            >
              <defs>
                <pattern
                  id="07690130-d013-42bc-83f4-90de7ac68f76"
                  x="0"
                  y="0"
                  width=".135"
                  height=".30"
                >
                  <circle cx="1" cy="1" r=".7" />
                </pattern>
              </defs>
              <rect
                fill="url(#07690130-d013-42bc-83f4-90de7ac68f76)"
                width="52"
                height="24"
              />
            </svg>
            <span className="relative">
              {t("dashboard.reports.case-details.image-gallery")}
            </span>
          </span>
        </h2>
      </div>
      <ReactImageGallery
        showNav={false}
        showPlayButton={false}
        items={dataImages ? dataImages : noImages}
      />
      <div>
        {loading ? (
          <TableSkeleton />
        ) : (
          reportDetails.vieweds &&
          reportDetails.vieweds.length > 0 &&
          userRole === "Admin" && (
            <ViewedsTable vieweds={reportDetails.vieweds} t={t} />
          )
        )}
      </div>
      <div className="flex justify-center items-center my-4">
        {showButton && (
          <Button
            onClick={handleDownload}
            severity="warning"
            icon="pi pi-save"
            size="small"
          >
            <p className="text-lg text-white ml-3">
              {t("dashboard.reports.case-details.evidences")}
            </p>
          </Button>
        )}
        {loadingevidences && (
          <CircularProgressWithLabel color="success" value={progress} />
        )}
      </div>
    </div>
  );
};
export function CircularProgressWithLabel(props) {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress variant="determinate" {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="caption" component="div" color="text.secondary">
          {`${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}
