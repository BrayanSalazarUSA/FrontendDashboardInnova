import React from 'react'
import Swal from 'sweetalert2';

export const getCalendar = async () => {
    const url = `${process.env.REACT_APP_SERVER_IP}/schedule`;
    let response;

    try{
        response = await fetch(url);
        if(!response.ok){
            throw new Error("Newtwork response was not ok");
        }
        const data = await response.json();
        console.log(data);
        return data
    }catch(error){
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Error al traer el calendario",
        })
        return [];
    }
}
