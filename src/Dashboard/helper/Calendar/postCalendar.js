import React from 'react'
import Swal from 'sweetalert2';

export const postCalendar = async (shift) => {
    const url = `${process.env.REACT_APP_SERVER_IP}/schedule`;
    console.log(shift)
    let newShift = {
    title: shift.title,
    start: shift.start,
    end: shift.end,
    participants:shift.extendedProps.participants}
    try{
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newShift),
        })

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to save this request");
        }
        const data = await response.text();
        console.log("Request saved successfully:", data);
    }catch(error){
        console.error('Failed to save this request:', error);
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Error al guardar el turno",
        })
    }
}
