import Swal from "sweetalert2";

export const putPropertyImage = async (propertyId, formData, t) => {
    try {
        const response = await fetch(`${process.env.REACT_APP_SERVER_IP}/properties/update-image/${propertyId}`, {
            method: 'PUT',
            body: formData,
        });

        if (response.ok) {
            const result = await response.json();
            Swal.fire({
                icon: 'success',
                title: t("dashboard.properties.dialog.edit-property.swal.image-updated"),
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                customClass: {
                    container: 'swal-overlay'
                }
            });
            return result;
        } else {
            const errorResponse = await response.text();
            console.error('Response error:', errorResponse);
            throw new Error(t("Error"));
        }
    } catch (error) {
        console.error('Error sending the property image or map:', error);
        Swal.fire({
            icon: 'error',
            title: "Error",
            text: error.toString(),
        });
    }
};
