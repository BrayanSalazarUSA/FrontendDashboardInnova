import Swal from 'sweetalert2';

export const putAddEvidences = async (reportId, localEvidences, t) => {
    const formData = new FormData();

    localEvidences.forEach(evidence => {
        formData.append('evidences', evidence.file);
    });
    
    try {
        const response = await fetch(`${ process.env.REACT_APP_SERVER_IP}/reports/${reportId}/asignar-evidencia`, {
            method: 'PUT',
            body: formData
        });

        if (response.ok) {
            const result = await response.json(); 
            Swal.fire({
                icon: 'success',
                title: t("dashboard.reports.edit-report.swal.evidence-updated-evidence"),
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true
            });
            return result; 
        } else {
            const errorResponse = await response.text(); 
            console.error('Response error:', errorResponse); 
            throw new Error('No fue posible cargar las evidencias correctamente.');
        }
    } catch (error) {
        console.error('Error al enviar las evidencias:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error al cargar las evidencias',
            text: error.toString(),
        });
    }
}
