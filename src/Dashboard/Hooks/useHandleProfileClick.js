import { useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';

const useHandleProfileClick = () => {
    const { setUserProvider } = useContext(UserContext);
    const navigate = useNavigate();

    return useCallback(() => {
        const userData = JSON.parse(localStorage.getItem("user"));
        if (!userData) {
            console.error("No user data available");
            return;
        }

        console.log("Datos recibidos en handleProfileClick:", userData);
        setUserProvider(userData); 
        navigate("/dashboard/UserDetails");
    }, [navigate, setUserProvider]);
};

export default useHandleProfileClick;