import swal from 'sweetalert2';

const getUserEmails = async () => {
    const url = `${process.env.REACT_APP_SERVER_IP}/users/searchEmails?keyword=`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const emails = await response.json();
        console.log(emails);  
        return emails;
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

export default getUserEmails;
