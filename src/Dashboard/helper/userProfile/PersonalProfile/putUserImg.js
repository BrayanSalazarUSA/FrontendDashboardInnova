import Swal from 'sweetalert2';

export const putUserImg = async (userId, file, t) => {
    const url = `${process.env.REACT_APP_SERVER_IP}/users/${userId}/update-profile-image`;

    try {
        const formData = new FormData();
        formData.append('img', file);

        const response = await fetch(url, {
            method: 'PUT',
            body: formData,
            headers: {
            }
        });

        const data = await response.json();

        if (response.ok) {
            Swal.fire({
                icon: 'success',
                text: t('dashboard.user-details.personal-profile.update-image-success'),
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000
            });
            // OJO falta agregar manejo del estado del usuario para actualizar la imagen
            
            return data;
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: data.message || t('dashboard.user-details.personal-profile.update-image-error'),
            });
            return null;
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.toString(),
        });
        return null;
    }
};
