import React, { useState } from "react";
import emailjs from "emailjs-com";
import { useTranslation } from "react-i18next";
import { SplitButton } from "primereact/splitbutton";
import { ProgressSpinner } from "primereact/progressspinner";
import swal from "sweetalert2";

const SendEmailComponent = ({
  emailTo,
  Cc,
  subject,
  message,
  images,
  videos,
  numberCase,
  incident,
  date,
  hour,
  onEmailSent,
  pdf,
  onHide
}) => {

  const { t } = useTranslation("global");
  console.log("subject");
  console.log(Cc);
  console.log(emailTo);
  const [sending, setSending] = useState(false);
  function getVideoInfo(url) {
    // Extraer el nombre del archivo de la URL
    const fileName = url.split("/").pop();
    // Eliminar el sufijo "_converted.mp4.mp4"
    const cleanName = fileName.replace("_converted.mp4.mp4", "");
    cleanName.replace("_", " ");
    console.log(cleanName);
    return cleanName;
  }

  // Función para organizar y capitalizar los nombres de los videos
  const organizeAndCapitalizeVideos = (videos) => {
    const extractNumber = (name) => {
      if (typeof name === "string") {
        const match = name.match(/^(\d+)-/);
        return match ? parseInt(match[1], 10) : null;
      }
      return null;
    };

    // Primero asegúrate de que todos los vídeos son objetos y tienen la propiedad 'name'
    const validatedVideos  = videos.map((video, index) => {
      console.log(video);
      if (typeof video === "string") {
        // Si es una cadena, conviértela a un objeto con la propiedad 'name'
        return {
          name: getVideoInfo(video),
          path: video,
          sortNumber: index + 1,
        };
      } else if (typeof video === "object" && video.name) {
        return video;
      } else {
        console.error("Invalid video format:", video);
        return {
          name: `Unknown ${index + 1}`,
          path: "",
          sortNumber: 1000 + index,
        }; // Proporcionar un valor predeterminado
      }
    });

    // Asigna números y organiza los nombres
    validatedVideos.forEach((video, index) => {
      let number = extractNumber(video.name);
      if (number === null) {
        video.name = `${index + 1}-${video.name}`;
        video.sortNumber = video.sortNumber || index + 1; // Usar el número de orden si ya está definido
      } else {
        video.sortNumber = number;
      }
      video.name = video.name.toUpperCase();
    });

    // Ordena basado en el número asignado
    validatedVideos.sort((a, b) => {
      return a.sortNumber - b.sortNumber;
    });

    return validatedVideos;
  };



  const sendEmail = () => {
    setSending(true);
   const videosList = organizeAndCapitalizeVideos(videos);
    const templateParams = {
      emailTo,
      Cc,
      subject, // asunto
      message,
      images,
      videosList,
      numberCase,
      incident,
      date,
      hour,
      pdf,
    };


    // EmailJS user ID, service ID, and template ID
    const userID = process.env.REACT_APP_EMAILJS_SENDINGD_REPORT_USER_ID;
    const serviceID = process.env.REACT_APP_EMAILJS_SENDINGD_REPORT_SERVICE_ID;
    const templateID =
      process.env.REACT_APP_EMAILJS_SENDINGD_REPORT_TEMPLATE_ID;

    emailjs.send(serviceID, templateID, templateParams, userID).then(
      (response) => {
        console.log("SUCCESS!", response.status, response.text);
        console.log("lo que se envia", templateParams);
        if (onEmailSent) {
          onEmailSent();
        }
        setSending(false);
      },
      (err) => {
        console.log("FAILED...", err);
        swal.fire({
            icon: 'warning',
            text: t("Error sending de email."),
            timer: 3000,
            position: 'top-end',
            showConfirmButton: false
        });
        onHide()
        setSending(false);
      }
    );
  };

  return (
    <div className="flex justify-end mt-2">
      {sending === false ? (
        <button className="send-button" onClick={sendEmail}>
          <div className="svg-wrapper-1">
            <div className="svg-wrapper">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
              >
                <path fill="none" d="M0 0h24v24H0z"></path>
                <path
                  fill="currentColor"
                  d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
                ></path>
              </svg>
            </div>
          </div>
          <span>{t("dashboard.cameras.dialog.send")}</span>
        </button>
      ) : (
        <div className="svg-wrapper-1">
          <ProgressSpinner
            style={{ width: "50px", height: "50px" }}
            strokeWidth="8"
            fill="gray"
            animationDuration=".5s"
          />
        </div>
      )}
    </div>
  );
};

export default SendEmailComponent;
