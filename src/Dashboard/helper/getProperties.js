import React, { useContext } from "react";
import Swal from "sweetalert2";

export const getPropertiesInfo = async (navigate, userRole) => {
 
  let resp = {};
 
  const url = `${process.env.REACT_APP_SERVER_IP}/properties`;
  const headers = new Headers();
  headers.append("Role", userRole)
  let data = {};
  try {
    resp = await fetch(url, { headers });

    data = await resp.json();
    
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error,
    });
  }

  if (resp.status == 404) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Error al buscar la informacion de la propiedad en la base de datos",
    });

    navigate("/login");
    return;
  }

  console.log(data);
  return data;
};