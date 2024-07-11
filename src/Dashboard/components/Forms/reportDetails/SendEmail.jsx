import React, { useState,useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { useTranslation } from 'react-i18next';
import ReactImageGallery from "react-image-gallery";
import "../../../pages/css/ReportDetails/SendEmail.css";
import SendEmailComponent from './SendEmailComponent';
import toggleReportVerificationSendingEmail from '../../../helper/ReportDetails/toggleReportVerificationSendingEmail ';
import swal from 'sweetalert2';
import getUserEmails from '../../../helper/ReportDetails/getUserEmails ';
import getUserToMappingEmail from '../../../helper/getUserToMappingEmail';

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
    pdf }) => {  

    const [userEmails, setUserEmails] = useState([]);
    const [suggestionsTo, setSuggestionsTo] = useState([]);
    const [suggestionsCc, setSuggestionsCc] = useState([]);    const { t } = useTranslation("global");
    //Se guardarán los destinatarios para mapearsen los campos automaticamente
    const [propertyClients, setPropertyClients] = useState({})
    const [mailData, setMailData] = useState({
        to: '',
        Cc: '',
        subject: `Report #${caseNumber} - Level ${incidentLevel} (${incidentEnglish}) - ${propertyName}`,
        body: ''
    });
    
    function organizeEmails(data) {
        // Filtrar los managers y otros
        const managers = data.filter(person => person.isManager === 1);
        const others = data.filter(person => person.isManager !== 1);
    
        // Ordenar otros alfabeticamente por nombre
        others.sort((a, b) => a.name.localeCompare(b.name));
    
        // Crear strings para "to" y "cc"
        const to = managers.map(manager => manager.email).join(', ');
        const cc = others.map(other => other.email).join(', ');
        
        return {
            to: to,
            cc: cc
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
            setMailData({
                mailData,
                to: destinatarios.to,
                Cc: destinatarios.cc
            })
        };

        fetchEmails();
        fetchClients();
    }, []);
    
    // Función para manejar cambios en los campos de entrada y generar sugerencias
    const handleInputChange = (e, field) => {
        setMailData(prev => ({ ...prev, [field]: e.target.value }));
        const searchString = e.target.value.split(/[,;]+/).pop().trim(); // Busca el último segmento después de una coma o punto y coma
        if (searchString.length > 0) {
            const filter = userEmails.filter(email => email.toLowerCase().includes(searchString.toLowerCase()));
            if (field === 'to') {
                setSuggestionsTo(filter.filter(email => !mailData.Cc.includes(email)));
            } else if (field === 'Cc') {
                setSuggestionsCc(filter.filter(email => !mailData.to.includes(email)));
            }
        } else {
            if (field === 'to') {
                setSuggestionsTo([]);
            } else if (field === 'Cc') {
                setSuggestionsCc([]);
            }
        }
    };

    const handleSuggestionClick = (email, field) => {
        // Calcula el nuevo valor del campo, reemplazando el texto de búsqueda actual con el correo electrónico seleccionado
        const currentValue = mailData[field];
        const lastCommaIndex = currentValue.lastIndexOf(',');
        const newValue = lastCommaIndex !== -1 ? currentValue.substring(0, lastCommaIndex + 1) : '';
        const finalValue = `${newValue} ${email}, `;

        // Actualiza el estado con el nuevo valor
        setMailData(prev => ({
            ...prev,
            [field]: finalValue.trimStart()  // Elimina espacios iniciales innecesarios
        }));

        // Limpia las sugerencias y el texto de búsqueda
        if (field === 'to') {
            setSuggestionsTo([]);
        } else if (field === 'Cc') {
            setSuggestionsCc([]);
        }

        // Borra cualquier texto residual en el campo de entrada
        document.getElementById(field).value = finalValue;
    };

    //Función de envio y verificacón del reporte
    const handleEmailSent = async () => {
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

        await toggleReportVerificationSendingEmail(reportId, !reportVerified, !reportVerified, t);
        updateVerification(true);
        onHide();
    };

    return (
        <div className="fondo-body-send-email p-4 text-white">
            <div className="banner-container">
                <img src="https://innova-bucket.s3.amazonaws.com/Assets/Banner.png" alt="Banner" />
            </div>
            <div className="text-center my-2">
                <p className='titulo-header'>Report #{caseNumber} - Level {incidentLevel} ({incidentType}) - {propertyName}</p>
            </div>
            <div className="grid grid-cols-1 gap-4 my-4 mx-2">
                <div className="border border-white p-4">
                    <div className="grid grid-cols-2 gap-4 ml-44">
                        <div>
                            <p className="titulo-header">{t("dashboard.reports.case-details.send-email-form.case-type")}</p>
                            <p>{incidentEnglish}</p>
                        </div>
                        <div>
                            <p className="titulo-header">{t("dashboard.reports.case-details.send-email-form.number-case")}</p>
                            <p>#{caseNumber}</p>
                        </div>
                    </div>
                </div>
                <div className="border border-white p-4">
                    <div className="grid grid-cols-2 gap-4 ml-44">
                        <div>
                            <p className="titulo-header">{t("dashboard.reports.case-details.send-email-form.incident-date")}</p>
                            <p>{incidentDate}</p>
                        </div>
                        <div>
                            <p className="titulo-header">{t("dashboard.reports.case-details.send-email-form.incident-time")}</p>
                            <p>{incidentStartTime}</p>
                        </div>
                    </div>
                </div>
            </div>


                      <div className="form-container">
                <div className="input-group">
                    <InputText autocomplete="off"  id="to" value={mailData.to} onChange={(e) => handleInputChange(e, 'to')}
                        placeholder={t("dashboard.reports.case-details.send-email-form.to")}
                    />
                    <div className="suggestions-container">
                        {suggestionsTo.map((email, index) => (
                            <div key={index} onClick={() => handleSuggestionClick(email, 'to')} className="suggestion-item">
                                {email}
                            </div>
                        ))}
                    </div>

                </div>

                 <div className="input-group">
                    <InputText autocomplete="off"  id="Cc" value={mailData.Cc} onChange={(e) => handleInputChange(e, 'Cc')}
                        placeholder="CC"
                    />
                    <div className="suggestions-container">
                        {suggestionsCc.map((email, index) => (
                            <div key={index} onClick={() => handleSuggestionClick(email, 'Cc')} className="suggestion-item">
                                {email}
                            </div>
                        ))}
                    </div>
                </div>
            
           
            
        


                <div className="input-group">
                    <InputText id="subject" value={mailData.subject} onChange={(e) => handleInputChange(e, 'subject')} placeholder={t("dashboard.reports.case-details.send-email-form.subject")} />
                </div>

                <div className="input-group">
                    <InputTextarea id="body" value={mailData.body} onChange={(e) => handleInputChange(e, 'body')} rows={5} autoResize style={{ resize: 'none' }} />
                </div>
                
                <div className="image-gallery-container mt-10">
                    <div className="flex justify-center mt-2 p-5">
                        <p className="titulo-images-videos">{ }</p>
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
                    <p className="titulo-header">{t("dashboard.reports.case-details.send-email-form.ids")}{/* Innova Dashboard System */}</p>
                </div>
                <div className="flex justify-center mt-2">
                    <p className="text-footer">{t("dashboard.reports.case-details.send-email-form.promo")}{/* This incident report is now available on our IDS Dashboard. Do you already have your subscription? */}</p>
                </div>
                <div className="flex justify-end mt-2">
                    {mailData?.to?.trim() || mailData?.Cc?.trim() ? (
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
                            pdf={`${process.env.REACT_APP_S3_BUCKET_URL}/${pdf}`}
                        />
                    ) : (
                            <button className="send-button" onClick={handleEmailSent} >
                            <div className="svg-wrapper-1">
                                <div className="svg-wrapper">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                        <path fill="none" d="M0 0h24v24H0z"></path>
                                        <path fill="currentColor" d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"></path>
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
