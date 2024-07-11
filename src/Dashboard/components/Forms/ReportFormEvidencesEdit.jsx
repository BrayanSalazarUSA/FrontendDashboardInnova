import React, { useContext, useEffect, useState } from "react";
import { InputTextarea } from "primereact/inputtextarea";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { UserContext } from "../../../context/UserContext";
import { postReport } from "../../helper/postReport";
import { useTranslation } from "react-i18next";

export const ReportFormEvidencesEdit = ({
  reportFormVisible,
  setReportFormVisible,
  reportSaved,
  setreportSaved,
}) => {
  const { reportForm, setReportForm } = useContext(UserContext);
  const { pdf, images, videos, evidences } = reportForm;
const [imageInput, setImageInput] = useState("")
const [videosInput, setVideosInput] = useState("")
  const [t] = useTranslation("global");
  let imagenesEvidence = evidences?.filter((evi) => evi.name == "Img");
  let videosEvidence = evidences?.filter((evi) => evi.name == "Vid");
  imagenesEvidence = imagenesEvidence?.map((i) => i.link);

  videosEvidence = videosEvidence?.map((i) => i.link);
  
  useEffect(() => {
    setVideosInput(videosEvidence.toString());
    setImageInput(imagenesEvidence.toString());
    
  }, [])
  

  const formatDate = (dateOfReport) => {
    console.log(dateOfReport.getMonth());
    console.log(dateOfReport.getDate());
    console.log(dateOfReport.getFullYear());
    let formatted_date =
      dateOfReport.getMonth() + 1 + "-" + dateOfReport.getDate() + "-" + dateOfReport.getFullYear();
    console.log(formatted_date);
    return formatted_date;
  };

  const formatTime = (dateOfReport) => {
    let formatted_date = dateOfReport.getHours() + ":" + dateOfReport.getMinutes();
    return formatted_date;
  };

  const splitEvidences = (evidendesString) => {
    let splitted = evidendesString.split(",");

    return splitted.map((evidence) => ({ evidence }));
  };

  const saveReport = async (reportForm, imageInput, videosInput) => {
    console.log(imageInput)
    console.log(videosInput);
    let evidences = [];
    let images = [];
    let videos = [];
    console.log(reportForm);
    if (imageInput?.length > 0) {
      images = imageInput?.split(",") || [];
    }
    if (videosInput.length > 0) {
      videos = videosInput?.split(",") || [];
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
console.log("Evidences")
    console.log(images)
    console.log(videos)
    console.log(evidences)
    const {
      id,
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
      id,
      agent,
      caseType,
      company,
      dateOfReport,
      timeOfReport,
      level,
      pdf,
      numerCase,
      property,
      evidences,
    };

    let fecha = new Date(reportForm.dateOfReport);

    let fecha2 = new Date(`09-24-2023 ${reportForm.timeOfReport}:00`);

    reportDto.dateOfReport = formatDate(fecha);
    reportDto.timeOfReport = formatTime(fecha2);

    console.log("Dto");
    console.log(reportDto);
    await postReport(reportDto);
    setReportFormVisible(false);
    setreportSaved(!reportSaved);
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
          value={imageInput}
          onChange={(e) =>
           setImageInput(e.target.value)
          }
          placeholder={t("dashboard.reports.edit-report.images")}
          rows={5}
          cols={30}
        />
      </div>
      <div className="p-inputgroup my-3 ml-3">
        <span className="p-inputgroup-addon">
          <i className="pi pi-video"></i>
        </span>
        <InputTextarea
          value={videosInput}
          onChange={(e) =>
            setVideosInput(e.target.value)
          }
          placeholder="Videos"
          rows={5}
          cols={30}
        />
      </div>
      <div className="w-full flex justify-end">
        <Button icon="pi pi-times" severity="danger" label="Cancel" />
        <div className="w-3"></div>
        <Button
          icon="pi pi-check"
          label="Send"
          onClick={() => saveReport(reportForm, imageInput, videosInput)}
        />
      </div>
    </div>
  );
};
