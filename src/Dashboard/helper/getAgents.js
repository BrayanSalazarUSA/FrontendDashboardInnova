import Swal from 'sweetalert2';

export const getAgents = async () => {
    const url = `${process.env.REACT_APP_SERVER_IP}/users/agents`;
    let response;

    try {
        response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const agents = data
            .filter(agent => agent.rol && agent.rol.rolName === "Monitor")
            .map(agent => {
                // Procesar la imagen para asegurarse de que se maneje correctamente
                const imageUrl = agent.image ? `${process.env.REACT_APP_S3_BUCKET_URL}/${agent.image}` : 'default-placeholder.png';

                return {
                    id: agent.id,
                    Name: agent.name,
                    Email: agent.email,
                    ImageUrl: imageUrl, // Solo incluir ImageUrl en el objeto
                    Rol: agent.rol.rolName,
                    numOfReportsUser: agent.numOfReportsUser || 0
                };
            });

        console.log("Filtered Agents:", agents);
        return agents;
    } catch (error) {
        console.error("Error al obtener agentes:", error);
        Swal.fire({
            icon: "error",
            title: "Error",
            text: error.toString(),
        });
        if (response && response.status === 404) {
            Swal.fire({
                icon: "error",
                title: "HTTP Error 404",
                text: "Error al buscar la información del agente en la base de datos",
            });
        }
        return [];
    }
};
