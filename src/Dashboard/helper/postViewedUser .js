const postViewedUser = async (userId, reportId) => {
    const url = `${process.env.REACT_APP_SERVER_IP}/viewed/${userId}/${reportId}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to mark as viewed");
        }

        const data = await response.text();
        console.log("Viewed record created successfully:", data);
    } catch (error) {
        console.error('Error marking report as viewed:', error);
    }
};

export default postViewedUser;
