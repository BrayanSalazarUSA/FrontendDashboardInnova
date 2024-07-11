import Swal from "sweetalert2";

export const GetPropertyInfo = async (id, userRole) => {
  const url = `${process.env.REACT_APP_SERVER_IP}/properties/${id}`;
  const headers = new Headers();
  headers.append("Role", userRole);
  try {
    const resp = await fetch(url, { headers });
    if (!resp.ok) {
      throw new Error(`HTTP status ${resp.status}`);
    }

    const data = await resp.json();

    // Verificar si el backend devuelve una respuesta de error
    if (data.message) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: data.message,
      });
      return null;
    }

    const propertyImage = `${process.env.REACT_APP_S3_BUCKET_URL}/${data.img}`;

    const dataDto = {
      ...data,
      camerasWorking: data.camerasOnline, 
      camerasOffline: data.camerasOffline,
      camerasVandalized: data.camerasVandalized,
      numOfCamerasTotal: data.numOfCamerasTotal};

    return dataDto;

  } catch (error) {
    console.error("Fetch error: ", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: `Ha ocurrido un problema con la petición Fetch: ${error.message}`,
    });
    return null;
  }
};
