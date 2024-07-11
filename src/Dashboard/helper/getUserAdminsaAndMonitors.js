import Swal from "sweetalert2";

export const getAdminsAndMonitors = async (navigate) => {
    let usersMapped = [];
    const url = `${process.env.REACT_APP_SERVER_IP}/users/admins-monitors`;
    let data = {};
    try {
        const resp = await fetch(url);
        if (!resp.ok) {
            throw new Error('Error fetching data');
        }
        data = await resp.json();

        console.log("Raw data from server:", data);

        usersMapped = data.map((user) => {
            if (user.name && !user.deleted) {
                let userImg = "https://innovamonitoring-bucket.s3.us-east-2.amazonaws.com/"+
                user?.image || "Resources/NoImage.png";

                return {
                    id: user.id,
                    name: user.name,
                    UserImage: userImg,
                    rol: user.rol,
                };
            }
            return undefined;
        }).filter(element => element !== undefined);

    } catch (error) {
        console.error("Error fetching data:", error);
        Swal.fire({
            icon: "error",
            title: "Error",
            text: error.toString(),
        });
    }

    if (!data.length) {
        Swal.fire({
            icon: "info",
            title: "Info",
            text: "No se encontraron usuarios con los roles especificados.",
        });
    }

    console.log("Processed usersMapped:", usersMapped);
    return usersMapped;
};
