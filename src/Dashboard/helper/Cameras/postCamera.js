import { CameraAltTwoTone } from '@mui/icons-material';
import React from 'react'
import Swal from 'sweetalert2';

export const postCamera = async (cameraForm, t) => {

  const formData = new FormData();
  const cameraData = {
    name: cameraForm.name,
    brand: cameraForm.brand,
    type: cameraForm.type,
    model: cameraForm.model,
    status: cameraForm.status,
    property: cameraForm.property,
    installedByUs: cameraForm.installedByUs,
  };

  formData.append("camera", new Blob([JSON.stringify(cameraData)], { type: 'application/json' }));

  if (cameraForm.imageFile) {
    formData.append('img', cameraForm.imageFile);   
  }
  const url = `${process.env.REACT_APP_SERVER_IP}/cameras`;

  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to save the camera.');
    }

    const data = await response.json();

    Swal.fire({
      icon: 'success',
      text: t("dashboard.cameras.create.success"), 
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true
    });

    return data;

  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.toString(),
    });
  }
}