import { useContext } from "react";
import Swal from "sweetalert2";
import { UserContext } from "../../context/UserContext";
import { putAddEvidences } from "./Reports/UpdateReport/putAddEvidences";

export const formatDate = (date) => {
  if (typeof date === "string") {
    date = new Date(date);
  }
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${month}-${day}-${date.getFullYear()}`;
};

export const formatTime = (date) => {
  if (!date) {
    return null; // Retorna null directamente si la fecha es null o undefined
  }
  if (typeof date === "string") {
    date = new Date(date);
  }
  let hours = date.getHours().toString().padStart(2, "0");
  let minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

export const postReport = async (
  reportForm,
  t,
  setCreatingReport,
  userId,
  updateContext,
  pdfBlob,
  pdfName,
  reportProgess,
  setReportProgess
) => {
  const formData = new FormData();

  const caseTypeData = {
    id: reportForm.isOtherSeeReportActive ? 10 : reportForm.caseType.id,
    incident: reportForm.isOtherSeeReportActive
      ? "Other See Report"
      : reportForm.caseType.incident,
    translate: reportForm.isOtherSeeReportActive
      ? "Otro tipo de reporte"
      : reportForm.caseType.translate,
  };

  formData.append(
    "report",
    new Blob(
      [
        JSON.stringify({
          createdBy: reportForm.createdBy,
          contributedBy: reportForm.contributedBy,
          caseType: caseTypeData,
          otherSeeReport:
            reportForm.isOtherSeeReportActive && reportForm.otherSeeReport
              ? reportForm.otherSeeReport
              : null,
          company: reportForm.company,
          level: reportForm.level,
          numerCase: reportForm.numerCase,
          property: reportForm.property,
          listMalfunctioningCameras: reportForm.listMalfunctioningCameras,
          camerasFunctioning: reportForm.camerasFunctioning ? 1 : 0,
          observedViaCameras: reportForm.observedViaCameras ? 1 : 0,
          policeFirstResponderNotified: reportForm.policeFirstResponderNotified
            ? 1
            : 0,
          policeFirstResponderScene: reportForm.policeFirstResponderScene,
          securityGuardsNotified: reportForm.securityGuardsNotified ? 1 : 0,
          securityGuardsScene: reportForm.securityGuardsScene ? 1 : 0,
          policeNumerCase: reportForm.policeNumerCase,
          formNotificationClient: reportForm.formNotificationClient,
          emailedReport: reportForm.emailedReport,
          reportDetails: reportForm.reportDetails,
          pdf: reportForm.pdf,
          dateOfReport: formatDate(reportForm.dateOfReport),
          timeOfReport: formatTime(reportForm.timeOfReport),
          incidentDate: formatDate(reportForm.incidentDate),
          incidentStartTime: formatTime(reportForm.incidentStartTime),
          incidentEndTime: reportForm.persist
            ? null
            : formatTime(reportForm.incidentEndTime), // Envía null si persist es true
          persist: reportForm.persist,
        }),
      ],
      { type: "application/json" }
    )
  );

  reportForm.evidences.forEach((evidence) => {
    if (evidence.type.startsWith("image/")) {
      // Añade la evidencia al formData con el nombre correspondiente
      formData.append("evidences", evidence.file);
    }
  });

  /*  reportForm.evidences.forEach((evidence) => {
    console.log(evidence);

    // Si la evidencia está encriptada, cambia el nombre, de lo contrario, usa el nombre original
    let evidenceName = evidence.isEncrypted
      ? `encrypted_${evidence.name}`
      : evidence.name;

    // Añade la evidencia al formData con el nombre correspondiente
    formData.append("evidences", evidence.file, evidenceName);
  });
 */

  // Añadir solo evidencias que no sean videos al formulario
  /*   reportForm.evidences
   .filter((evidence) => evidence.type !== "video")
   .forEach((evidence) => {
     let evidenceName = evidence.isEncrypted
       ? `encrypted_${evidence.name}`
       : evidence.name;

     formData.append("evidences", evidence.file, evidenceName);
   }); */

  formData.append("pdf", pdfBlob, pdfName); // Asegúrate de usar el nombre correcto aquí

  const url = `${process.env.REACT_APP_SERVER_IP}/reports`;
  updateContext();
  try {
    console.log("User id");
    console.log(userId);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        userid: userId,
      },
      body: formData,
    });

    const data = await response.json();

    if (response.ok) {
      console.log("Report Form si si", reportForm);
      Swal.fire({
        icon: "success",
        title: t("dashboard.reports.new-report.swal.report-send"),
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      console.log(reportForm);

      const videoEvidences = reportForm.evidences.filter((evidence) =>
        evidence.type.startsWith("video/")
      );

      console.log(videoEvidences);
      console.log("reportForm.evidences");
      console.log(reportForm.evidences);
      // Calcula el incremento del progreso
      const progressIncrement = Math.round(100 / videoEvidences.length, 2);

      // Inicializa el progreso en 0
      setReportProgess(0);

      videoEvidences.forEach(async (evidence) => {
        console.log(evidence);
        await putAddEvidences(data.id, evidence, t, userId);
        setReportProgess((prevProgress) => prevProgress + progressIncrement);
      });

      setCreatingReport(false);
      // alert("Evidences Ready")
  
      return data;
    } else {
      setCreatingReport(false);

      throw new Error(
        data.message || t("dashboard.reports.new-report.swal.error-saving")
      );
    }
  } catch (error) {
    console.log("Report Form Si no", reportForm);
    setCreatingReport(false);
    console.error("Error saving the report:", error);
    return null;
  }
};
