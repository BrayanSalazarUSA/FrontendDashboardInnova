import Swal from 'sweetalert2';

export const putUserInfo = async (input, userId, t) => {
    const userInfo = {
        id: userId,  
        name: input.name,
        email: input.email,
        password: input.password,
        rol: {
            id: input.rol.rolKey, 
            rolName: input.rol.originalName
        }
    };

    const url = `${process.env.REACT_APP_SERVER_IP}/users/${userId}`;


    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userInfo)
        });

        const data = await response.json();

        if (response.ok) {
            Swal.fire({
                icon: 'success',
                text: t('dashboard.user-details.personal-profile.update-success'),
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true
            });
            return data;  
        } else {
            throw new Error(data.message || t('dashboard.user-details.personal-profile.update-error'));
        }
    } catch (error) {
        console.error('Failed to update user:', error);
        Swal.fire({
            icon: 'error',
            title: t('dashboard.user-details.personal-profile.update-error-title'),
            text: error.message || t('dashboard.user-details.personal-profile.update-error'),
        });
        throw error;  
    }
};
