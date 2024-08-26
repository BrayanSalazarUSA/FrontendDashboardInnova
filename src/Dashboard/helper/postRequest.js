const postRequest = async (newRequest) => {
    const url = `${process.env.REACT_APP_SERVER_IP}/requests/new`;
 console.log('newRequest')
 console.log(newRequest)
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newRequest),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to save this request");
        }

        const data = await response.text();
        console.log("Request saved successfully:", data);
    } catch (error) {
        console.error('Failed to save this request:', error);
    }
};

export default postRequest;
