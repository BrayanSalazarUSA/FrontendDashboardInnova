import { useContext } from "react";
import Swal from "sweetalert2";
import { UserContext } from "../../context/UserContext";
import { putAddEvidences } from "./Reports/UpdateReport/putAddEvidences";

export const sendVideos = async (
    reportForm,
    t,
    setCreatingReport,
    userId,
    updateContext,
    pdfBlob,
    pdfName,
    reportProgess,
    setReportProgess,
    reportId
) => {

    updateContext();
console.log("Se ejecutó el sendVideos")
console.log(reportId)

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

      // Aquí usamos Promise.all para esperar a que todos los videos se suban
    await Promise.all(
        videoEvidences.map(async (evidence) => {
            console.log(evidence);
            await putAddEvidences(reportId, evidence, t, userId);
            setReportProgess((prevProgress) => prevProgress + progressIncrement);
        })
    );

    // Aquí, después de que todas las promesas (subidas de videos) se hayan completado, finalmente ponemos setCreatingReport en false
    setCreatingReport(false);

};
