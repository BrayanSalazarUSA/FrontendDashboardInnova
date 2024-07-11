import React from 'react'
import Swal from 'sweetalert2';

const getReportsMontly = async(id, userRole) => {
  
    const url = `${process.env.REACT_APP_SERVER_IP}/reports/montly/${id}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (response.status === 404) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error al buscar la información de la propiedad en la base de datos",
        });
        return [];  
      }

      if (userRole === "Client") {
        return data.filter(report => report.verified);

      } else {
        console.log("data del admin", data)
        return data;
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
      });
      return [];  
    }
}

export default getReportsMontly