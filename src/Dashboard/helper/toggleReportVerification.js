import Swal from 'sweetalert2';
import "../pages/css/Reports/NewReport.css"

export const toggleReportVerification = async (id, verified, t) => {
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
            title: t('dashboard.reports.table.admin.verifiedchanged'),
            showConfirmButton: false,
            timer: 3000,
            customClass: {
                container: 'wrong-property'
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
                container: 'wrong-property'
            }
        });
        return verified; // Devuelve el estado original en caso de error
    }
};
