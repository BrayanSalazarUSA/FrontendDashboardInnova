// chatGPTRequest.js
import Swal from 'sweetalert2';

const chatGPTRequest = async (message) => {
    const url = `https://innova-dashboard.com/chatboot/chat?message=${encodeURIComponent(message)}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.text();
        return data;
    } catch (error) {
        console.error("Error en la petición a ChatGPT:", error);
        Swal.fire({
            icon: "error",
            title: "Error",
            text: error.toString(),
        });
        return null;
    }
};

export default chatGPTRequest;
