import { useContext } from "react";
import Swal from "sweetalert2";
import { UserContext } from "../../context/UserContext";
import { putAddEvidences } from "./Reports/UpdateReport/putAddEvidences";

export const formatDate = (date) => {
  if (!date) return ""; // Retornar una cadena vacía si date no es válido
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
  setSendingReport,
  userId,
  updateContext,
  pdfBlob,
  pdfName,
  reportProgess,
  setReportProgess,
  setCreatingReport,
  visible, setVisible,
) => {
  setSendingReport(true);

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

      setCreatingReport(true);

      for (const evidence of videoEvidences) {
        console.log(evidence);
        await putAddEvidences(data.id, evidence, t, userId); // Espera a que se complete la petición para esta evidencia
        setReportProgess((prevProgress) => prevProgress + progressIncrement); // Actualiza el progreso
      }

      setCreatingReport(false); // Una vez todas las evidencias se hayan subido
setVisible(false)
      return data;
    } else {
      throw new Error(
        data.message || t("dashboard.reports.new-report.swal.error-saving")
      );
    }
  } catch (error) {
    console.log("Report Form Si no", reportForm);

    console.error("Error saving the report:", error);
    return null;
  }
};
