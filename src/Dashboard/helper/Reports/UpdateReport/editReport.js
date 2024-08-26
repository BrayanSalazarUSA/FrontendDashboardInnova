import React from 'react';
import Swal from 'sweetalert2';

const formatDate = (date) => {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${month}-${day}-${date.getFullYear()}`;
};

const formatTime = (date) => {
  if (!date) {
    return null; // Retorna null directamente si la fecha es null o undefined
  }
  if (typeof date === 'string') {
    date = new Date(date);
  }
  let hours = date.getHours().toString().padStart(2, '0');
  let minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};


export const editReport = async (reportForm, isOtherSeeReportActive, t, pdfBlob, pdfName) => {
  const formattedData = {
    ...reportForm,
    dateOfReport: formatDate(reportForm.dateOfReport),
    timeOfReport: formatTime(reportForm.timeOfReport),
    incidentDate: formatDate(reportForm.incidentDate),
    incidentStartTime: formatTime(reportForm.incidentStartTime),
    incidentEndTime: formatTime(reportForm.incidentEndTime),
    caseType: {
      id: isOtherSeeReportActive ? 10 : reportForm.caseType.id,
      incident: isOtherSeeReportActive ? "Other See Report" : reportForm.caseType.incident,
      translate: isOtherSeeReportActive ? "Otro tipo de reporte" : reportForm.caseType.translate
    },
    otherSeeReport: isOtherSeeReportActive ? reportForm.otherSeeReport : null
  };

  delete formattedData.evidences;

  const formData = new FormData();


  formData.append("report", new Blob([JSON.stringify({
    createdBy: reportForm.createdBy,
    contributedBy: reportForm.contributedBy,
    caseType: {
      id: isOtherSeeReportActive ? 10 : reportForm.caseType.id,
      incident: isOtherSeeReportActive ? "Other See Report" : reportForm.caseType.incident,
      translate: isOtherSeeReportActive ? "Otro tipo de reporte" : reportForm.caseType.translate
    },
    otherSeeReport: reportForm.isOtherSeeReportActive && reportForm.otherSeeReport ? reportForm.otherSeeReport : null,
    company: reportForm.company,
    level: reportForm.level,
    numerCase: reportForm.numerCase,
    property: reportForm.property,
    listMalfunctioningCameras: reportForm.listMalfunctioningCameras,
    camerasFunctioning: reportForm.camerasFunctioning ? 1 : 0,
    observedViaCameras: reportForm.observedViaCameras ? 1 : 0,
    policeFirstResponderNotified: reportForm.policeFirstResponderNotified ? 1 : 0,
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
    incidentEndTime: reportForm.persist ? null : formatTime(reportForm.incidentEndTime), // Envía null si persist es true
    persist: reportForm.persist,
  })], { type: 'application/json' }));

  formData.append('pdf', pdfBlob, pdfName); // Asegúrate de usar el nombre correcto aquí


  const url = `${process.env.REACT_APP_SERVER_IP}/reports/${formattedData.id}`;
  try {
    const response = await fetch(url, {
      method: "PUT",
      body: formData,
      
    });

    const data = await response.json();

    if (response.ok) {
      Swal.fire({
        icon: 'success',
        title: t("dashboard.reports.edit-report.swal-updated-report-form.success"),
        text: t("dashboard.reports.edit-report.swal-updated-report-form.report-updated"),
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
      });
      return data;
    } else {
      throw new Error(data.message || t("dashboard.reports.edit-report.swal-updated-report-form.error-saving"));
    }
  } catch (error) {
    console.error("Error updating the report:", error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message || t("dashboard.reports.edit-report.swal-updated-report-form.error-saving"),
    });
    return null;
  }
};
