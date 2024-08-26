import Swal from 'sweetalert2';

export const archiveReport = async (agentName, reportId, t) => {
    try {
        const response = await fetch(`${process.env.REACT_APP_SERVER_IP}/reports/download/${reportId}?agent=${agentName}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            // Intenta parsear la respuesta como JSON
            try {
                const result = await response.json();
                console.log("Reporte Archivado Correctamente", result);
            } catch (jsonError) {
                // Si no es JSON, maneja la respuesta como texto
                const result = await response.text();
                console.log("Reporte Archivado Correctamente", result);
            }
        } else {
            const errorResponse = await response.text(); 
            console.error('Response error:', errorResponse); 
            throw new Error('No fue posible descargar el reporte');
        }
    } catch (error) {
        console.error('Error al enviar las evidencias:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error el reporte',
            text: error.toString(),
        });
    } 
}
