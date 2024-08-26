const updateRequest = async (newRequest) => {
    const url = `${process.env.REACT_APP_SERVER_IP}/requests/update`;
 console.log('newRequest')
 console.log(newRequest)
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newRequest),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to update this request");
        }
//TODO: Agregar validacion para que muestre si hay error en modal 500
        const data = await response.text();
        console.log("Request updated successfully:", data);
    } catch (error) {
        console.error('Failed to update this request:', error);
    }
};

export default updateRequest;
