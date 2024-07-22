import Swal from 'sweetalert2';

export const getRequest = async () => {
    const url = `${process.env.REACT_APP_SERVER_IP}/users/request/all`;
    let response;

    try {
        response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
  
        return data;
    } catch (error) {
        console.error("Error al traer las Requests:", error);
        Swal.fire({
            icon: "error",
            title: "Error",
            text: error.toString(),
        });
        if (response && response.status === 404) {
            Swal.fire({
                icon: "error",
                title: "HTTP Error 404",
                text: "Error al buscar la información de las investigaciones en la base de datos",
            });
        }
        return [];
    }
};
