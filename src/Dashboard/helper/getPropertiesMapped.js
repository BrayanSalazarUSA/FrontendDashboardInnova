import React, { useContext } from "react";
import Swal from "sweetalert2";

export const getPropertiesMapped = async (navigate, userRole) => {
  let resp = {};
  let properties = [];
  const headers = new Headers();
  headers.append("Role", userRole)
  const url = `${process.env.REACT_APP_SERVER_IP}/properties`;

  try {
    resp = await fetch(url, { headers });

    if (resp.status === 200) {
      let data = await resp.json();

      properties = data.map((property) => {
        // Añade la URL de la imagen al objeto property, asegurando que si 'img' es vacío, se use una imagen por defecto.
        property.PropertyImage = `${process.env.REACT_APP_S3_BUCKET_URL}/${property.img || "Resources/NoImage.png"}`;

        property.name = property.name || " ";
        property.direction = property.direction || " ";
        property.mapImg = property.mapImg || "Resources/NoImage.png";
        property.img = property.img || "Resources/NoImage.png";

        return property;
      });
    } else {
      throw new Error("Failed to fetch properties.");
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error.message || "Error desconocido",
    });

    if (resp.status === 404) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al buscar la información de la propiedad en la base de datos",
      });

      navigate("/login");
      return;
    }
  }

  console.log(properties);
  return properties;
};
