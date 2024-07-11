import Swal from "sweetalert2";

const getReportsNoVerified = async () => {
    const url = `${process.env.REACT_APP_SERVER_IP}/reports/noVerified`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching non-verified reports:', error);
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Failed to fetch non-verified reports. Please try again later.'
        });
            throw error;
    }
};

export { getReportsNoVerified };

