// editCamera.js
import Swal from 'sweetalert2';

export const putEditCamera = async (cameraId, cameraData, t) => {
    const { imageFile, ...dataToSend } = cameraData;  // Excluye la imagen del objeto enviado

    try {
        const response = await fetch(`${process.env.REACT_APP_SERVER_IP}/cameras/${cameraId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSend)
        });

        if (response.ok) {
            const result = await response.json();
            Swal.fire({
                icon: 'success',
                title: t("dashboard.cameras.update.camera-update"),
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true
            })
            return result;  
        } else {
            throw new Error('No fue posible actualizar la información de la cámara correctamente.');
        }
    } catch (error) {
        console.error('Error al enviar la información de la cámara:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error al actualizar la información de la cámara',
            text: error.toString(),
        });
        throw error;  
    }
}
