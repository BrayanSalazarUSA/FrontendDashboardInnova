import Swal from 'sweetalert2';

const putDeletePropertyToUser = async (userId, propertyId, t) => {
    const url = `${process.env.REACT_APP_SERVER_IP}/users/${userId}/remover-propiedad`;

    // Confirmación de eliminación
    const result = await Swal.fire({
        title: t("dashboard.user-details.properties.table.delete-assigned-property.confirm-title"),
        text: t("dashboard.user-details.properties.table.delete-assigned-property.confirm-text"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        confirmButtonText: t("dashboard.user-details.properties.table.delete-assigned-property.yes"),
        cancelButtonColor: '#d33',
        cancelButtonText: t('dashboard.user-details.properties.table.delete-assigned-property.no')
    });


    if (result.isConfirmed) {
        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: propertyId })
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                throw new Error(errorResponse.error || "Failed to delete property");
            }

            const data = await response.json();

            Swal.fire({
                toast: true,
                position: 'top-end',
                text: `${t('dashboard.user-details.properties.property-remove')}`,
                icon: 'success',
                showConfirmButton: false,
                timer: 3000
            });
            return { success: true, data: data };
        } catch (error) {
            console.error('Error deleting property:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message,
                showConfirmButton: true,
            });
            return { success: false, message: error.message };
        }
    } else {
        return { success: false, message: "Operation cancelled" };
    }
};

export default putDeletePropertyToUser;

