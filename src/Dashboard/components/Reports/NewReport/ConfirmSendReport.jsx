import React from 'react';
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { postReport } from '../../../helper/postReport';
import "../../../pages/css/Reports/NewReport.css"
import {createHTMLStringToSend} from '../../../helper/ReportDetails/exportPdfEvidences';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

//Ubicar en otro lugar ya que es el que se usa tambien al editar el reporte
export const sendPDFToBucket = async (reportData) => {
    console.log(reportData);
    const htmlString = createHTMLStringToSend(reportData);
    const htmlContent = document.createElement('div');
    htmlContent.style.width = "1000px";
    htmlContent.innerHTML = htmlString;
    document.body.appendChild(htmlContent);


    const canvas = await html2canvas(htmlContent, {
        scale: 2, // Aumenta la calidad de la imagen
        width: htmlContent.offsetWidth,
        windowWidth: htmlContent.offsetWidth
    });
    
        document.body.removeChild(htmlContent);

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4'
    });


    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    const scaleX = pdfWidth / imgWidth;
    const scaleY = pdfHeight / imgHeight;
    const scale = Math.min(scaleX, scaleY);
    pdf.addImage(imgData, 'PNG', scaleX, scaleY, imgWidth * scale, imgHeight * scale);
   
// Convertir el PDF en un Blob
const pdfBlob = pdf.output('blob');
return pdfBlob;
}

const ConfirmSendReport = ({ properties, reportData, setCreatingReport, navigate, resetReportForm, user, setShowConfirmDialog, setPropertyContext, isOtherSeeReportActive }) => {
    const [t] = useTranslation("global");
    const [selectedProperty, setSelectedProperty] = React.useState(null); 
    const {caseType, property, level, numerCase, otherSeeReport} = reportData

    const handleConfirm = async () => {
        if (!selectedProperty || selectedProperty.id !== reportData.property.id) {
            Swal.fire({
                icon: "error",
                title: t("dashboard.reports.new-report.swal.wrong-property"),
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                customClass: {
                    container: 'wrong-property'
                }
            });
            return;
        }

        navigate("/dashboard/reports");
        setCreatingReport(true);
        const updateContext = () => setPropertyContext(selectedProperty); 
        const pdfBlob = await sendPDFToBucket(reportData)
        let pdfName = `#${numerCase} - Level ${level} - (${caseType.incident}${otherSeeReport ? ' _ ' + otherSeeReport : ''}) - ${property.name}.pdf`;

        await postReport({ ...reportData, property: selectedProperty, isOtherSeeReportActive: isOtherSeeReportActive }, t, setCreatingReport, user.id, updateContext, pdfBlob, pdfName);
        resetReportForm();
        setShowConfirmDialog(false);
        
    };

    const handleDeny = () => {
        resetReportForm();
        setShowConfirmDialog(false);
    };

    const handleCancel = () => {
        setShowConfirmDialog(false);
    };


    return (
        <div className="confirm-send-report">
            <h3 className='mb-4'>{t("dashboard.reports.new-report.swal.confirmation")}</h3>
            <Dropdown
                value={selectedProperty}
                options={properties}
                onChange={(e) => setSelectedProperty(e.value)}
                optionLabel="name"
                placeholder={t("dashboard.reports.new-report.select-property")}
                filter
                showClear
                filterBy="name"
                className="w-full"
            />
            <div className="button-container"> 
                
                <Button
                    label={t("dashboard.reports.new-report.swal.cancel")}
                    icon="pi pi-times"
                    className="p-button-text mr-2"
                    onClick={handleCancel}
                />
                <Button
                    label={t("dashboard.reports.new-report.swal.don't-save")}
                    icon="pi pi-times-circle"
                    className="p-button-danger mr-2 mx-4"
                    onClick={handleDeny}
                />
                <Button
                    label={t("dashboard.reports.new-report.swal.send")}
                    icon="pi pi-check"
                    className="p-button-info"
                    onClick={handleConfirm}
                />
            </div>
        </div>
    );
};

export default ConfirmSendReport;