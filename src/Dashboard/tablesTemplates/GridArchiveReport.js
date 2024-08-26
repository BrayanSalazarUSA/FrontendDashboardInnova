import React, { useState, useEffect } from "react";
import { MdOutlineArchive } from "react-icons/md";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import { CircularProgressWithLabel } from "../pages/ReportDatails";
import { archiveReport } from "../helper/Reports/UpdateReport/archiveReport";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { formatDate } from "../helper/postReport";
import { exportPdfEvidences } from "../helper/ReportDetails/exportPdfEvidences";
import JSZip from "jszip";
import { createFolderName } from "../helper/Reports/Archive/helpsers";

export const GridArchiveReport = (props) => {
  const { downloadedOn, downloadedBy } = props;
  const { id, downloaded, setRefreshReports } = props;
  const { t } = useTranslation("global");
  const [loadingevidences, setLoadingevidences] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(downloaded); // Estado local para downloaded
  const [progress, setProgress] = useState(0);
  const [folderName, setFolderName] = useState("");
  const [filesToDownload, setFilesToDownload] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const userName = user?.name;
  let infoTooltipe = "Not Archived";

  if (downloadedOn) {
    infoTooltipe = downloadedBy + " - " + formatDate(downloadedOn);
  }
  useEffect(() => {
    let evidences = props?.evidences?.map((evidence) => ({
      name: evidence.name,
      url: `${process.env.REACT_APP_S3_BUCKET_URL}/${evidence.path}`,
    }));
    setFilesToDownload(evidences);

    const { company, property, level, numerCase, caseType, otherSeeReport } =
      props;

    const folder = createFolderName(
      property,
      company,
      caseType,
      otherSeeReport,
      level,
      numerCase
    );

    console.log(folder);
    console.log("folder");
    // Actualizar el estado con el nombre de la carpeta generado
    setFolderName(folder);
  }, []);

  useEffect(() => {
    setIsDownloaded(downloaded); // Inicializar el estado local con la prop downloaded
  }, [downloaded]);

  const handleArchive = async () => {
    setLoadingevidences(true);
    try {
      setLoadingevidences(true); // Activar el loader
      // Generación del pdf para agregarlo a la descarga
      const zip = new JSZip();
      const pdfBlob = await exportPdfEvidences(props);
      const { caseType, property, level, numerCase, otherSeeReport } = props;

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

      await archiveReport(userName, id);

      // Refrescar los reportes
      setRefreshReports((prev) => !prev);

      Swal.fire(
        "Success",
        "Reporte Archivado exitosamente por: " + userName,
        "success"
      );
    } catch (e) {
      console.error("Error al archivar el reporte:", e);
      Swal.fire({
        icon: "error",
        title: "Error al archivar el reporte",
        text: e.toString(),
      });
    } finally {
      setLoadingevidences(false);
      setProgress(0); // Restablecer el progreso
      // Cambiar el estado local para actualizar el color del ícono
      setTimeout(() => setIsDownloaded(true), 4000);
    }
  };
  let style = {
    display: "inline-block",
    width: "400px",
  };
  return (
    <div
      onClick={handleArchive}
      className={`flex justify-center cursor-pointer m-0 p-0 ${
        isDownloaded ? "text-blue-500" : "text-gray-500"
      }`}
    >
      {loadingevidences ? (
        <CircularProgressWithLabel color="success" value={progress} />
      ) : (
        <TooltipComponent
          content={infoTooltipe || "Not Archived"}
          position="bottom"
        >
          <MdOutlineArchive className="text-lg" />
        </TooltipComponent>
      )}
    </div>
  );
};
