import React from 'react'
import Swal from 'sweetalert2';

export const getUserById = async (id) => {
    if (!id) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se ha proporcionado un ID de usuario válido",
        });
        return;
    }

    const url = `${process.env.REACT_APP_SERVER_IP}/users/${id}`;
    let resp = {};
    let userData = {};

    try {
        resp = await fetch(url);
        const data = await resp.json();

        if (resp.ok) {
           
            userData = {
                user: data,
            };

            console.log(userData);
            return userData;
        } else {
            throw new Error(resp.statusText);
        }
    } catch (error) {
        console.error("Error fetching user:", error);
        Swal.fire({
            icon: "error",
            title: "Error",
            text: `Error al buscar la información del usuario: ${error.toString()}`,
        });
        return; // Retorna undefined en caso de error
    }

    if (resp.status === 404) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "El usuario no existe en la base de datos",
        });
    }
};
