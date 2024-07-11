import React, { useContext } from "react";
import { InputTextarea } from "primereact/inputtextarea";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { UserContext } from "../../../context/UserContext";
import { postReport } from "../../helper/postReport";
import { useTranslation } from "react-i18next";


export const ReportFormEvidences = ({
  reportFormVisible,
  setReportFormVisible,
  reportSaved,
  setreportSaved,
}) => {

  const { reportForm, setReportForm } = useContext(UserContext);
  const { pdf, images, videos } = reportForm;
  let formatted_date;


  const formatDate = (dateOfReport) => {
    if (!dateOfReport){
      dateOfReport = new Date()
}

    formatted_date = dateOfReport.getMonth() + 1 + "-" + dateOfReport.getDate() + "-" + dateOfReport.getFullYear();
    return formatted_date;
  };

  const formatTime = (dateOfReport) => {
    if (!dateOfReport){
      dateOfReport = new Date()
    }

    let formatted_date = dateOfReport.getHours() + ":" + dateOfReport.getMinutes();
    return formatted_date;
  };

  const saveReport = async (reportForm) => {
    let evidences = [];
    let images = [];
    let videos = [];

    if (reportForm.images?.length > 0) {
      images = reportForm.images?.split(",") || [];
    }
    if (reportForm.videos?.length > 0) {
      videos = reportForm.videos?.split(",") || [];
    }

    images.forEach((img) => {
      evidences.push({
        link: img,
        name: "Img",
      });
    });

    videos.forEach((vid) => {
      evidences.push({
        link: vid,
        name: "Vid",
      });
    });

    const {
      agent,
      caseType,
      company,
      dateOfReport,
      timeOfReport,
      level,
      pdf,
      numerCase,
      property,
    } = reportForm;
    let reportDto = {
      agent,
      caseType,
      company,
      dateOfReport,
      timeOfReport,
      camerasFunctioning: reportForm.camerasFunctioning ? 1 : 0, 
      level,
      pdf,
      numerCase,
      property,
      evidences,
    };
    reportDto.dateOfReport = formatDate(reportForm.dateOfReport);
    reportDto.timeOfReport = formatTime(reportForm.timeOfReport);

  
    await postReport(reportDto);
    setReportFormVisible(false);
    setreportSaved(!reportSaved);
  };
const [t] = useTranslation("global")
  const handleDialogHide = () => {
    setReportFormVisible(false);
    setReportForm({});
  };
  return (
    <div>
      <div className="p-inputgroup my-3 ml-3">
        <span className="p-inputgroup-addon">
          <i className="pi pi-hashtag"></i>
        </span>
        <InputText
          value={pdf}
          onChange={(e) =>
            setReportForm((i) => {
              return { ...reportForm, pdf: e.target.value };
            })
          }
          placeholder="PDF"
        />
      </div>
      <div className="p-inputgroup my-3 ml-3">
        <span className="p-inputgroup-addon">
          <i className="pi pi-image"></i>
        </span>
        <InputTextarea
          value={images}
          onChange={(e) =>
            setReportForm((i) => {
              return { ...reportForm, images: e.target.value };
            })
          }
          placeholder={t("dashboard.reports.new-report.images")}
          rows={5}
          cols={30}
        />
      </div>
      <div className="p-inputgroup my-3 ml-3">
        <span className="p-inputgroup-addon">
          <i className="pi pi-video"></i>
        </span>
        <InputTextarea
          value={videos}
          onChange={(e) =>
            setReportForm((i) => {
              return { ...reportForm, videos: e.target.value };
            })
          }
          placeholder="Videos"
          rows={5}
          cols={30}
        />
      </div>
      <div className="w-full flex justify-end">
        <Button icon="pi pi-times" severity="danger" label={t("dashboard.reports.new-report.cancel")} onClick={() => {setReportFormVisible(false); setReportForm({});}} />
        <div className="w-3"></div>
        <Button icon="pi pi-check" label={t("dashboard.reports.new-report.send")} onClick={() => saveReport(reportForm)} />
      </div>
    </div>
  );
};
