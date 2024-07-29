import React, { useState, useEffect, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Chips } from "primereact/chips";

import { InputTextarea } from "primereact/inputtextarea";
import { useTranslation } from "react-i18next";
import ReactImageGallery from "react-image-gallery";
import "../../../pages/css/ReportDetails/SendEmail.css";
import SendEmailComponent from "./SendEmailComponent";
import toggleReportVerificationSendingEmail from "../../../helper/ReportDetails/toggleReportVerificationSendingEmail ";
import swal from "sweetalert2";
import getUserEmails from "../../../helper/ReportDetails/getUserEmails ";
import getUserToMappingEmail from "../../../helper/getUserToMappingEmail";
import { Avatar, ListItem, ListItemAvatar, ListItemText } from "@mui/material";

const SendEmail = ({
  incidentType,
  incidentLevel,
  caseNumber,
  incidentEnglish,
  incidentDate,
  incidentStartTime,
  images,
  videos,
  propertyName,
  propertyId,
  reportId,
  reportVerified,
  updateVerification,
  onHide,
  pdf,
}) => {
  const [userEmails, setUserEmails] = useState([]);
  const [chipsToValue, setChipsToValue] = useState([]);
  const [chipsCCValue, setChipsCCValue] = useState([]);
  const [suggestionsTo, setSuggestionsTo] = useState([]);
  const [suggestionsCc, setSuggestionsCc] = useState([]);
  const inputRef = useRef(null);
  const inputRefCC = useRef(null);
  const { t } = useTranslation("global");
  const [subject, setSubject] = useState("")
  const [mailData, setMailData] = useState({
    to: "",
    Cc: "",
    subject: `Report #${caseNumber} - Level ${incidentLevel} (${incidentEnglish}) - ${propertyName}`,
    body: "Hello team, Please see below incident report.",
  });

  function organizeEmails(data) {

    // Filtrar los managers y otros
    const managers = data.filter((person) => person.isManager === 1);
    const others = data.filter((person) => person.isManager !== 1);

    // Ordenar otros alfabeticamente por nombre
    others.sort((a, b) => a.name.localeCompare(b.name));

    // Crear strings para "to" y "cc"
    const to = managers.map((manager) => manager.email).join(",");
    const cc = others.map((other) => other.email).join(",");

    return {
      to: to,
      cc: cc,
    };

  }

  useEffect(() => {
    const fetchEmails = async () => {
      const emails = await getUserEmails();
      setUserEmails(emails);
    };

    const fetchClients = async () => {
      const clients = await getUserToMappingEmail(propertyId, incidentLevel);
      const destinatarios = organizeEmails(clients);
      const to = destinatarios.to?.trim().split(",");
      const cc = destinatarios.cc?.trim().split(",");

      setChipsToValue(to);
      setChipsCCValue(cc);
      setMailData((prevMailData) => ({
        ...prevMailData,
        to: destinatarios.to,
        Cc: destinatarios.cc,
      }));
    };
    console.log(mailData);
    fetchEmails();
    fetchClients();
  }, []);

// Refs for suggestion containers
const suggestionsToRef = useRef(null);
const suggestionsCcRef = useRef(null);

  useEffect(() => {
    console.log("MailData actualizado:");
    console.log(mailData);
  }, [mailData]);

  useEffect(() => {
    // Handler to close suggestions when clicking outside
    const handleClickOutside = (event) => {
      if (suggestionsToRef.current && !suggestionsToRef.current.contains(event.target)) {
        setSuggestionsTo([]);
      }
      if (suggestionsCcRef.current && !suggestionsCcRef.current.contains(event.target)) {
        setSuggestionsCc([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  // Función para manejar cambios en los campos de entrada y generar sugerencias
  const handleInputChange = (e, field) => {
    const searchString = e.target.value.split(/[,;]+/).pop().trim(); // Busca el último segmento después de una coma o punto y coma
    if (searchString.length > 0) {
      const filtered = userEmails.filter((user) =>
        user.email.toLowerCase().includes(searchString.toLowerCase())
      );

      console.log('filtered')
      console.log(filtered)
      if (field === "To") {
        setSuggestionsTo(
          filtered
          /*  filtered.filter((user) => !mailData.to.some(toUser => toUser.email === user.email))   */
     /* [
            {
              name: "Danny Lopez",
              email: "danny@innovatechcorp.net",
              image: "https://innova-bucket.s3.amazonaws.com/profiles/danny.webp",
              rol: null,
              numOfReportsUser: 0
            },
            {
              name: "Maria Ospina",
              email: "maria@innovatechcorp.net",
              image: "https://innova-bucket.s3.amazonaws.com/profiles/Maria.webp",
              rol: null,
              numOfReportsUser: 0
            },
            {
              name: "Laura Franco",
              email: "Laura@innovamonitoring.net",
              image: "https://innova-bucket.s3.amazonaws.com/profiles/Imagen_de_WhatsApp_2024-06-17_a_las_14.54.38_95293b4a.jpg",
              rol: null,
              numOfReportsUser: 0
            },
            {
              name: "Cliente Pruebas",
              email: "brayansalazar.dev@gmail.com",
              image: "https://innova-bucket.s3.amazonaws.com/profiles/rs=w_1440,h_1440.webp",
              rol: null,
              numOfReportsUser: 0
            }
       ] */
     );
      } else if (field === "Cc") {
        setSuggestionsCc(filtered);
      }
      if (field === "body") {
        console.log('Previous body:', mailData.body);
        console.log('New value:', e.target.value);
        setMailData({ ...mailData, body: e.target.value });
        console.log('Updated body:', mailData.body);
      }
    } else {
      if (field === "To") {
        setSuggestionsTo([]);
      } else if (field === "Cc") {
        setSuggestionsCc([]);
      }
    }
  };

  const handleSuggestionClick = (email, field) => {
    if (field == "To") {
      setChipsToValue([...chipsToValue, email]);
      let newTo = [...chipsToValue, email].join(",");
      setMailData((prevMailData) => ({ ...prevMailData, to: newTo }));
      setSuggestionsTo([]);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    } else if (field == "Cc") {
      setChipsCCValue([...chipsCCValue, email]);
      let newCc = [...chipsToValue, email].join(",");
      setMailData((prevMailData) => ({ ...prevMailData, Cc: newCc }));
      setSuggestionsCc([]);
      if (inputRefCC.current) {
        inputRefCC.current.value = '';
      }
    }

    console.log('suggestionsToRef')
    console.log(suggestionsToRef)
  };

  const handleRemove = (emailToRemove, field) => {
    console.log("Remove");
    console.log(field);
    if (field == "To") {
      console.log("Removido " + emailToRemove);
      const updatedToChips = chipsToValue.filter(
        (email) => email != emailToRemove
      );
      setChipsToValue(updatedToChips);
      const to = updatedToChips.join(",");
      setChipsToValue(updatedToChips);
      setMailData((prevMailData) => ({ ...prevMailData, to: to }));
    } else if (field == "Cc") {
      console.log("Removido " + emailToRemove);
      const updatedCcChips = chipsCCValue.filter(
        (email) => email != emailToRemove
      );
      setChipsCCValue(updatedCcChips);
      const cc = updatedCcChips.join(",");
      setMailData((prevMailData) => ({ ...prevMailData, Cc: cc }));
      console.log("MailData");
      console.log(mailData);
    }
  };

  //Función de envio y verificacón del reporte
  const handleEmailSent = async () => {
    console.log(chipsToValue);
    console.log(chipsCCValue);

     if (!mailData.to.trim() && !mailData.Cc.trim()) {
            swal.fire({
                icon: 'warning',
                text: t("dashboard.reports.case-details.send-email-form.verified-send"),
                timer: 3000,
                position: 'top-end',
                showConfirmButton: false
            });
            return;
        }

        updateVerification(true);
        await toggleReportVerificationSendingEmail(reportId, !reportVerified, !reportVerified, t);
        onHide(); 
  };

  const handleKeyDown = (event, field) => {
    if (event.key === "Enter") {
      if (event.target.value.trim() !== "") {
        if (field == "To") {
          setChipsToValue([...chipsToValue, event.target.value.trim()]);
          let newTo = [...chipsToValue, event.target.value.trim()].join(",");
          setMailData((prevMailData) => ({ ...prevMailData, to: newTo }));
        } else if (field == "Cc") {
          setChipsCCValue([...chipsCCValue, event.target.value.trim()]);
          let newCC = [...chipsCCValue, event.target.value.trim()].join(",");
          setMailData((prevMailData) => ({ ...prevMailData, Cc: newCC }));
        }
      }
    }
  };

  return (
    <div className="fondo-body-send-email p-4 text-white">
      <div className="banner-container">
        <img
          src="https://innova-bucket.s3.amazonaws.com/Assets/Banner.png"
          alt="Banner"
        />
      </div>
      <div className="text-center my-2">
        <p className="titulo-header">
          Report #{caseNumber} - Level {incidentLevel} ({incidentType}) -{" "}
          {propertyName}
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 my-4 mx-2">
        <div className="border border-white p-4">
          <div className="grid grid-cols-2 gap-4 ml-44">
            <div>
              <p className="titulo-header">
                {t("dashboard.reports.case-details.send-email-form.case-type")}
              </p>
              <p>{incidentEnglish}</p>
            </div>
            <div>
              <p className="titulo-header">
                {t(
                  "dashboard.reports.case-details.send-email-form.number-case"
                )}
              </p>
              <p>#{caseNumber}</p>
            </div>
          </div>
        </div>
        <div className="border border-white p-4">
          <div className="grid grid-cols-2 gap-4 ml-44">
            <div>
              <p className="titulo-header">
                {t(
                  "dashboard.reports.case-details.send-email-form.incident-date"
                )}
              </p>
              <p>{incidentDate}</p>
            </div>
            <div>
              <p className="titulo-header">
                {t(
                  "dashboard.reports.case-details.send-email-form.incident-time"
                )}
              </p>
              <p>{incidentStartTime}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="form-container">
        <div className="p-fluid">
          <Chips
            className="p-chips-custom"
            value={chipsToValue}
            onKeyDown={(e) => {
              handleInputChange(e, "To");
              handleKeyDown(e, "To");
            }}
            inputRef={inputRef}
            inputClassName="p-chips-input"
            placeholder="To"
            onRemove={(e) => handleRemove(e.value, "To")}
          />
        </div>
        <div className="input-group">
          <div className="suggestions-container" ref={suggestionsToRef}>   
            {suggestionsTo.map((user, index) => (
              <ListItem key={index} className="suggestion-item" component="div" onClick={() => handleSuggestionClick(user?.email, "To")}>
              <ListItemAvatar>
                <Avatar src={`${process.env.REACT_APP_S3_BUCKET_URL}/${user.image}`} />
              </ListItemAvatar>
              <ListItemText color="white" primary={user.email} secondary={user.name}/>
            </ListItem>
              ))}
            </div>
        </div>
        <div className="p-fluid">
          <div className="p-fluid">
            {/* Falta no permitir duplicados */}
            <Chips
              className="p-chips-custom"
              value={chipsCCValue}
              onKeyDown={(e) => {
                handleInputChange(e, "Cc");
                handleKeyDown(e, "Cc");
              }}
              inputRef={inputRefCC}
              inputClassName="p-chips-input"
              placeholder="Cc"
              onRemove={(e) => handleRemove(e.value, "Cc")}
            />
          </div>
          <div className="input-group">
            <div className="suggestions-container"  ref={suggestionsCcRef}>   
            {suggestionsCc.map((user, index) => (
              <ListItem key={index} className="suggestion-item" component="div" onClick={() => handleSuggestionClick(user.email, "Cc")}>
              <ListItemAvatar>
                <Avatar src={`${process.env.REACT_APP_S3_BUCKET_URL}/${user.image}`} />
              </ListItemAvatar>
              <ListItemText color="white" primary={user.name} secondary={user.email} />
            </ListItem>
              ))}
            </div>
          </div>
        </div>
              
        <div className="input-group">
          <InputText
            id="subject"
            value={mailData.subject}
            onChange={(e) => setMailData({ ...mailData, subject: e.target.value })}
            placeholder={t("dashboard.reports.case-details.send-email-form.subject")}
          />
        </div>

        <div className="input-group">
        <textarea
        id="body"
        value={mailData.body}
        onChange={(e) =>  setMailData({ ...mailData, body: e.target.value })}
        rows={5}
        style={{ resize: "none" }}
      />
        </div>

        <div className="image-gallery-container mt-10">
          <div className="flex justify-center mt-2 p-5">
            <p className="titulo-images-videos">{}</p>
          </div>
          <ReactImageGallery
            items={images}
            showNav={false}
            showPlayButton={false}
            showFullscreenButton={false}
          />
        </div>

        <div className="video-gallery-container mt-10">
          <div className="flex justify-center mt-2 p-5">
            <p className="titulo-header">Videos</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {videos?.map((video, index) => (
              <div key={index} className="flex flex-col items-center w-auto">
                <video controls width="300">
                  <source src={video} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center mt-2">
          <p className="titulo-header">
            {t("dashboard.reports.case-details.send-email-form.ids")}
            {/* Innova Dashboard System */}
          </p>
        </div>
        <div className="flex justify-center mt-2">
          <p className="text-footer">
            {t("dashboard.reports.case-details.send-email-form.promo")}
            {/* This incident report is now available on our IDS Dashboard. Do you already have your subscription? */}
          </p>
        </div>
        <div className="flex justify-end mt-2">
          {mailData.to.length > 0 || mailData.Cc.length > 0 ? (
            <SendEmailComponent
              emailTo={mailData.to}
              Cc={mailData.Cc}
              subject={mailData.subject}
              message={mailData.body}
              images={images}
              videos={videos}
              numberCase={caseNumber}
              incident={incidentEnglish}
              date={incidentDate}
              hour={incidentStartTime}
              onEmailSent={handleEmailSent}
              onHide={onHide}
              pdf={`${process.env.REACT_APP_S3_BUCKET_URL}/${pdf}`}
            />
          ) : (
            <button className="send-button" onClick={handleEmailSent}>
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
          )}
        </div>
      </div>
    </div>
  );
};

export default SendEmail;
