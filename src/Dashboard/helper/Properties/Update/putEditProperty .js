
import Swal from 'sweetalert2';

export const putEditProperty = async (propertyId, propertyData, t) => {
    const { img, mapImg, ...dataToSend } = propertyData;  

    try {
        const response = await fetch(`${process.env.REACT_APP_SERVER_IP}/properties/${propertyId}`, {
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
                title: t("dashboard.properties.update.success"),
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true
            });
            return result; 
        } else {
            throw new Error('No fue posible actualizar la información de la propiedad correctamente.');
        }
    } catch (error) {
        console.error('Error al enviar la información de la propiedad:', error);
        Swal.fire({
            icon: 'error',
            title: t("dashboard.properties.update.error"),
            text: error.toString(),
        });
        throw error;  
    }
}
