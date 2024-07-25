import Swal from "sweetalert2";

export const getUsersDTO = async () => {
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
                let userImg = process.env.REACT_APP_S3_BUCKET_URL+
                user?.image || "Resources/NoImage.png";

                return {
                    id: user.id,
                    name: user.name,
                    image: user.image,
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
