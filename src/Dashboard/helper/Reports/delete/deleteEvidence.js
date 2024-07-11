import Swal from 'sweetalert2';

const deleteEvidence = async (evidence, reportId, setReportForm, t) => {
    try {
        // Acá se determina si la evidencia es local o del servidor
        if (evidence.url.startsWith('blob:')) {
            // Evidencia local
            URL.revokeObjectURL(evidence.url);
            setReportForm(prev => ({
                ...prev,
                evidences: prev.evidences.filter(file => file.id !== evidence.id)
            }));
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: t('dashboard.reports.edit-report.evidence-removed'),
                showConfirmButton: false,
                timer: 3000
            });
        } else {
            // Evidencia de la bd y el S3
            const response = await fetch(`${process.env.REACT_APP_SERVER_IP}/reports/${reportId}/eliminar-evidencia`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: evidence.id, path: evidence.path, name: evidence.name })
            });
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            const updatedEvidences = await response.json();
            if (Array.isArray(updatedEvidences.evidences)) {
                setReportForm(prev => ({
                    ...prev,
                    evidences: updatedEvidences.evidences
                }));

                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: t('dashboard.reports.edit-report.evidence-removed'),
                    showConfirmButton: false,
                    timer: 3000
                });

            } else {
                console.error('Expected evidences to be an array, got:', updatedEvidences.evidences);
            }

          
        }
    } catch (error) {
        console.error('Error deleting evidence:', error);

        Swal.fire('Error!', t('dashboard.reports.edit-report.error-removing-evidence'), 'error');
    }
};

export default deleteEvidence;
