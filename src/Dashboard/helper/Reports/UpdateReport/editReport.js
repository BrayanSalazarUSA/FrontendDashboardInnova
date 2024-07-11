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


export const editReport = async (reportForm, isOtherSeeReportActive, t) => {
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


  const url = `${process.env.REACT_APP_SERVER_IP}/reports/${formattedData.id}`;
  try {
    const response = await fetch(url, {
      method: "PUT",
      body: JSON.stringify(formattedData),
      headers: {
        "Content-Type": "application/json",
      }
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
