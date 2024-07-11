import Swal from 'sweetalert2';
import '../../../pages/css/Cameras/Cameras.css'

export const putImageCamera = async (cameraId, imageFile, t) => {
    const formData = new FormData();
    formData.append('img', imageFile);

    try {
        const response = await fetch(`${process.env.REACT_APP_SERVER_IP}/cameras/update-image/${cameraId}`, {
            method: 'PUT',
            body: formData
        });

        if (response.ok) {
            const result = await response.json();
            Swal.fire({
                icon: 'success',
                title: t("dashboard.cameras.update.swal.image-updated"),
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                 customClass: {
                    container: 'swal-overlay'
                }
                
            });
            return result;
        } else {
            const errorResponse = await response.text();
            console.error('Response error:', errorResponse);
            throw new Error('No fue posible actualizar la imagen de la cámara correctamente.');
        }
    } catch (error) {
        console.error('Error al enviar la imagen de la cámara:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error al actualizar la imagen de la cámara',
            text: error.toString(),
        });
    }
}
