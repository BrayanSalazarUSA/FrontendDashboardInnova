import React from 'react'
import Swal from 'sweetalert2';


export const getUsers = async (navigate) => {
 
    let resp = {};
    let usersMapped = []
    const url = `${process.env.REACT_APP_SERVER_IP}/users`;
    let data = {};
    try {
      resp = await fetch(url);
      data = await resp.json();
      usersMapped = data.map((user) => {

        let userImg = `${process.env.REACT_APP_S3_BUCKET_URL}/${user.image}`
        if(user.image == null || user.image === ""){
        userImg ="https://static-00.iconduck.com/assets.00/user-avatar-1-icon-511x512-ynet6qk9.png"
       }
        
      
        return {
          UserImage: userImg,
          StatusBg: "#8BE78B",
            Email: user.email,
            Name: user.name,
            Rol: user?.rol?.rolName,
            user,
            id:user.id
        };
      });


    } catch (error) {
      console.error("Error fetching users:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.toString(),
      });
      return []; // Retorna un arreglo vacío en caso de error
    }
  
    if (resp.status == 404) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al buscar la informacion  de los usuarios en la base de datos",
      });
  
      return;
    }
  
    console.log(usersMapped);
    return usersMapped;
  };
  