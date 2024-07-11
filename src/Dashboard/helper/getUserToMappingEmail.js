import swal from 'sweetalert2';

const getUserToMappingEmail = async (propertyId, reportLevel) => {
    const url = `${process.env.REACT_APP_SERVER_IP}/properties/${propertyId}/users-emails?reportLevel=${reportLevel}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const clients = await response.json();
        console.log(clients);  
        return clients;
    } catch (error) {
        console.error("Error fetching emails:", error);
        swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to fetch emails: ' + error.toString(),
        });
        return []; 
    }
};

export default getUserToMappingEmail;