import Swal from 'sweetalert2';

export const getAllReports = async () => {
    const url = `${process.env.REACT_APP_SERVER_IP}/reports`;

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
        console.error('Error fetching reports:', error);
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Failed to fetch reports. Please try again later.'
        });
        throw error; // Optional: re-throw the error if you want to handle it later.
    }
};
