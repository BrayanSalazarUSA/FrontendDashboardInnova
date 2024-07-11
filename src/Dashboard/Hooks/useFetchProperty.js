import React, { useEffect, useState } from "react";
import { GetPropertyInfo } from "../helper/getPropertyInfo";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";


const useFetchProperty = (id, navigate) => {
  const [property, setProperty] = useState([]);
  const [isLoading, setIsLoading] = useState(true);



  const getProperty = async () => {
    if(id > 0){
      const user = JSON.parse(localStorage.getItem("user") || '{}'); // Obtener el usuario del localStorage
      const userRole = user.role?.rolName || ""; // Obtener el rol del usuario
      
      const property = await GetPropertyInfo(id, userRole);
      console.log("Property Info:", property); 
      setProperty(property);
      setIsLoading(false);
    } else {
      Swal.fire("Info", "Este usuario no tiene ninguna propiedad asignada, asignele una para poder ingresar a IDS", "info");
    }
  };

  useEffect(() => {
    getProperty(id);
  }, [id]); 

  return {
    property,
    isLoading,
  };
};

export default useFetchProperty;
