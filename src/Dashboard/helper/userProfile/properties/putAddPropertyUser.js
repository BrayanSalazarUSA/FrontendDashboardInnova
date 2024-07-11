import Swal from "sweetalert2";

export const putAddPropertyUser = async (userId, properties, t) => {
    const url = `${process.env.REACT_APP_SERVER_IP}/users/${userId}/asignar-propiedad`;

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(properties)
        });

        const data = await response.json();
        if (response.ok) {
            const propertyNames = properties.map(p => p.name).join(', ');
            Swal.fire({
                icon: 'success',
                text: `${propertyNames} ${t('dashboard.user-details.properties.added-to-user')}`,
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000
            });
            return { success: true, data: data };
        } else {
            throw new Error(data.message || "Unknown error occurred");
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: t('Error'),
            text: error.toString(),
        });
        return { success: false, message: error.message };
    }
};