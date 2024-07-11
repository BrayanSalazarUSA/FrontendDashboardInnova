export const getNumberOfReportsByRole = async (propertyId, userId, userRole) => {
    const url = `${process.env.REACT_APP_SERVER_IP}/reports/property/${propertyId}/user/${userId}`;
    const headers = new Headers();
    headers.append("Role", userRole);

    try {
        const response = await fetch(url, { headers });
       
        if (response.status === 204) {
            return []; 
        }
        if (!response.ok) { 
            if (response.status === 404) {
                console.log("No se encontraron reportes para esta propiedad y usuario.");
                return [];
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        } 
        const reports = await response.json();
        console.log(reports)
        return reports; 
    } catch (error) {
        console.error("Fetch error: ", error.message);
        return null;
    }
};
