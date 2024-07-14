import React from 'react';
import emailjs from 'emailjs-com';
import { useTranslation } from 'react-i18next';


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
    pdf
}) => {
    const { t } = useTranslation("global");
console.log('subject')
console.log(subject)
    function getVideoInfo(url) {
        // Extraer el nombre del archivo de la URL
        const fileName = url.split('/').pop();
        // Eliminar el sufijo "_converted.mp4.mp4"
        const cleanName = fileName.replace('_converted.mp4.mp4', '');
        cleanName.replace("_", " ");
        console.log(cleanName)
       return cleanName;
    }

    // Función para organizar y capitalizar los nombres de los videos
    const organizeAndCapitalizeVideos = (videoList) => {
        const extractNumber = (name) => {
            if (typeof name === 'string') {
                const match = name.match(/^(\d+)-/);
                return match ? parseInt(match[1], 10) : null;
            }
            return null;
        };

        // Primero asegúrate de que todos los vídeos son objetos y tienen la propiedad 'name'
        const validatedVideos = videoList.map((video, index) => {
            console.log(video)
            if (typeof video === 'string') { // Si es una cadena, conviértela a un objeto con la propiedad 'name'
                return { name: getVideoInfo(video), path: video, sortNumber: index + 1 };
            } else if (typeof video === 'object' && video.name) {
                return video;
            } else {
                console.error('Invalid video format:', video);
                return { name: `Unknown ${index + 1}`, path: '', sortNumber: 1000 + index }; // Proporcionar un valor predeterminado
            }
        });

        // Asigna números y organiza los nombres
        validatedVideos.forEach((video, index) => {
            let number = extractNumber(video.name);
            if (number === null) {
                video.name = `${index + 1}-${video.name}`;
                video.sortNumber = video.sortNumber || index + 1;  // Usar el número de orden si ya está definido
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
    console.log(videos)
   

    const generateHtmlForImages = () => {
        return images.map(img => {
            return `
            <div class="mj-column-per-33-33 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:33.33%;">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                    <tbody>
                        <tr>
                            <td style="vertical-align:top;padding:0px;">
                                <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                                    <tbody>
                                        <tr>
                                            <td align="center" style="font-size:0px;padding:10px 5px;word-break:break-word;">
                                                <a href="${img.original}" target="_blank">
                                                    <img alt="${img.original.split('/').pop()}" height="auto" src="${img.original}" style="border:0;border-radius:5px;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="323">
                                                </a>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
        }).join('');
    }

    const generateHtmlForVideos = () => {
        const organizedVideos = organizeAndCapitalizeVideos(videos);
        return organizedVideos.map(video => `
            <tr>
                <td align="left" style="font-size:0px;padding:10px 25px;padding-bottom:10px;word-break:break-word;">
                    <div style="font-family:Arial, sans-serif;font-size:13px;line-height:1;text-align:left;color:#1a73e8;">
                        <a href="${video.path}" style="color: #1a73e8; text-decoration: none; cursor: pointer;">
                            <img src="https://img.icons8.com/ios-glyphs/30/000000/play--v1.png" class="icon" style="width: 15px; height: 15px; vertical-align: middle; margin-right: 5px;">
                            ${video.name}
                        </a>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    const sendEmail = () => {
        const imagesHtml = generateHtmlForImages();
        const videosHtmlColumn1 = generateHtmlForVideos();

        const templateParams = {
            emailTo,
            Cc,
            subject, // asunto 
            message,
            imagesHtml,
            videosHtmlColumn1, 
            numberCase,
            incident,
            date,
            hour,
            pdf
        };
console.log('templateParams')
console.log(templateParams)

        // EmailJS user ID, service ID, and template ID
        const userID = process.env.REACT_APP_EMAILJS_SENDINGD_REPORT_USER_ID;
        const serviceID = process.env.REACT_APP_EMAILJS_SENDINGD_REPORT_SERVICE_ID;
        const templateID = process.env.REACT_APP_EMAILJS_SENDINGD_REPORT_TEMPLATE_ID;

        emailjs.send(serviceID, templateID, templateParams, userID)
            .then(response => {
                console.log('SUCCESS!', response.status, response.text);
                console.log("lo que se envia", templateParams)
                if (onEmailSent){
                    onEmailSent();
                }
            }, err => {
                console.log('FAILED...', err);
            });
    };

    return (
        <div className="flex justify-end mt-2">
            <button className="send-button" onClick={sendEmail}>
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
        </div>
    );
};

export default SendEmailComponent;
