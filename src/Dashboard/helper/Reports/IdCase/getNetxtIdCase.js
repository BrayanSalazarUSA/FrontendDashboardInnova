import Swal from 'sweetalert2';

export const getNextIdCase = async () => {
    const url = `${process.env.REACT_APP_SERVER_IP}/reports/nextIdCase`;
    let response;

    try {
        response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
    
        return response;    
    } catch (error) {
        console.error("Error al obtener el próximo número de caso:", error);
        Swal.fire({
            icon: "error",
            title: "Error",
            text: error.toString(),
        });
        if (response && response.status === 404) {
            Swal.fire({
                icon: "error",
                title: "HTTP Error 404",
                text: "No se encontró el recurso solicitado",
            });
        }
        return null;
    }
};
