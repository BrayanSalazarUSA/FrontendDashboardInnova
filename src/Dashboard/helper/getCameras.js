import React from 'react';
import Swal from 'sweetalert2';

export const getCameras = async (id, navigate) => {
  const url = `${process.env.REACT_APP_SERVER_IP}/cameras/property/${id}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const cameras = await response.json();

    const camerasMapped = cameras.map((camera) => {
      let StatusBg = "#8BE78B";
      if (camera.status === "Offline") {
        StatusBg = "gray";
      }
      if (camera.status === "Vandalized") {
        StatusBg = "red";
      }
      return {
        ...camera,
        StatusBg,
      };
    });

    console.log(camerasMapped);
    return camerasMapped;
  } catch (error) {
    console.error('Error fetching cameras:', error);

    Swal.fire({
      icon: "error",
      title: "Error",
      text: `Error al buscar la información de la propiedad: ${error.message}`,
    });

    navigate("/login");
  }
};