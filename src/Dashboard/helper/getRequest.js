import Swal from "sweetalert2";

export const getRequests = async (propertyId, status) => {
  let resp = {};
  const baseUrl  = process.env.REACT_APP_SERVER_IP + `/requests-filter`;
  let data = {};

  // Configura los parámetros opcionales
  const queryParams = new URLSearchParams();
  if (propertyId) queryParams.append("propertyId", propertyId);
  if (status) queryParams.append("status", status);

  // Concatenar la URL completa
  const url = `${baseUrl}?${queryParams.toString()}`;

  try {
    resp = await fetch(url);
    data = await resp.json(); 
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.toString(),
    });
    return; 
  }
  return data; 
};
