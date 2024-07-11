// En el archivo toggleReportVerificationSendingEmail.js
import Swal from 'sweetalert2';
import "../../pages/css/ReportDetails/SendEmail.css"


const toggleReportVerificationSendingEmail = async (id, verified, shouldVerify, t) => {
    if (!shouldVerify) {
        console.log("Report is already verified. Skipping verification.");
        return verified;  // Retorna el estado actual sin cambios si ya está verificado
    }

    const url = `${process.env.REACT_APP_SERVER_IP}/reports/${id}/verify`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { "Content-Type": "application/json" }
        });
        const result = await response.json();
        if (!response.ok) {
            throw new Error(t('errorMessages.failedToToggle'));
        }

        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: t('dashboard.reports.case-details.send-email-form.report-validated'),
            showConfirmButton: false,
            timer: 3000,
            customClass: {
                container: 'index-swal'
            }
        });

        return result.data.verified;
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: t('errorMessages.general'),
            text: error.toString(),
            timer: 5000,
            customClass: {
                container: 'index-swal'
            }
        });
        return verified; 
    }
};

export default toggleReportVerificationSendingEmail;
