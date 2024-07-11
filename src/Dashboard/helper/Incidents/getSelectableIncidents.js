import Swal from "sweetalert2";

export const getSelectableIncidents = async (navigate) => {
    const url = `${process.env.REACT_APP_SERVER_IP}/cases`;
    let data = [];
    try {
        const resp = await fetch(url);
        if (!resp.ok) {
            if (resp.status === 404) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Error al buscar la información de la propiedad en la base de datos",
                });
                navigate("/login");
            } else {
                throw new Error("Failed to fetch incidents");
            }
            return []; 
        }

        data = await resp.json();
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: error.toString(),
        });
        return []; 
    }

    // Filtra los incidentes para excluir aquellos con el tipo "Other See Report"
    return data.filter(incident => !incident.deleted && incident.incident !== "Other See Report").map(incident => ({
        id: incident.id,
        incident: incident.incident,
        translate: incident.translate
    }));
};
