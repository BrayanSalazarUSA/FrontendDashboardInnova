import Swal from 'sweetalert2';

const deleteReport = async (reportId, t) => {
    const result = await Swal.fire({
        title: t('dashboard.reports.table.delete-report.delete-header'),
        text: t("dashboard.reports.table.delete-report.delete-text"),
        icon: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: t('dashboard.reports.table.delete-report.yes'),
        showCancelButton: true,
        cancelButtonColor: '#d33',
        cancelButtonText: "No"
    });

    if (result.isConfirmed) {
        const url = `${process.env.REACT_APP_SERVER_IP}/reports/${reportId}`;
        try {
            const response = await fetch(url, { method: 'DELETE' });
            if (!response.ok) throw new Error(t('dashboard.reports.table.delete-report.error-deleting'));
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: t('dashboard.reports.table.delete-report.report-removed'),
                showConfirmButton: false,
                timer: 3000
            });
            return true;
        } catch (error) {
            Swal.fire('Error!', t('dashboard.reports.table.delete-report.error-deleting'), 'error');
            return false;
        }
    }
    return false;
};

export default deleteReport;
