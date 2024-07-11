import React from 'react';
import Swal from 'sweetalert2';

export const postNewUser = async (formData, t) => {
  const url = `${process.env.REACT_APP_SERVER_IP}/users`;
  
console.log()
console.log(formData)

  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData 
    });

    const data = await response.json();

    if (response.ok) {
      Swal.fire({
        icon: 'success',
        text: t('dashboard.users.dialog-add-user.successful-response'),
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: data.message || 'Error saving the user, check that all fields are filled in and try again.',
      });
      console.error("Error en la respuesta:", data);
    }

    return data;
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.toString(),
    });
    console.error("Error al enviar datos:", error);
    return null;
  }
};
