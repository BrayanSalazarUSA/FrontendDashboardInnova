import { CameraAltTwoTone } from "@mui/icons-material";
import React from "react";
import Swal from "sweetalert2";

export const postNewProperty = async (propertyProvider, t) => {
  const url = `${process.env.REACT_APP_SERVER_IP}/properties`;
  const formData = new FormData();

  // Empaquetar la información de la propiedad excluyendo los archivos
  const propertyData = {
    name: propertyProvider.name,
    direction: propertyProvider.direction,
  };

  formData.append("property", new Blob([JSON.stringify(propertyData)], { type: 'application/json' }));

  // Agregar archivos si están disponibles
  if (propertyProvider.img && propertyProvider.img instanceof File) {
    formData.append("img", propertyProvider.img);
  }

  if (propertyProvider.mapImg && propertyProvider.mapImg instanceof File) {
    formData.append("map", propertyProvider.mapImg);
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`${t('dashboard.properties.dialog.swal.error-saving-property')}: ${response.statusText}`);
    }

    const data = await response.json();
    Swal.fire({
      icon: 'success',
      title: t('dashboard.properties.dialog.swal.added-property'),
      timer: 3000
    });

    return data;

  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: t('dashboard.properties.dialog.swal.error'),
      text: error.toString(),
    });
  }
};