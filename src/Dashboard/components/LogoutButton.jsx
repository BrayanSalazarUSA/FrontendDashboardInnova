import React from 'react';
import { BiLogOut } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import { useStateContext } from '../../context/ContextProvider';
import { UserContext } from '../../context/UserContext';

const LogoutButton = ({ bgColor, color, bgHoverColor, size, text, borderRadius, width }) => {
    const { setIsClicked, initialState } = useStateContext();
    const navigate = useNavigate();

    const logout = () => {
        localStorage.clear('user');
        localStorage.clear('propertySelected');
        navigate('/login');
    };

    return (
        <button
            type="button"
            onClick={() => {
                logout();
                setIsClicked(initialState);
            }}
            style={{ backgroundColor: bgColor, color, borderRadius }}
            className={`text-${size} p-3 w-${width} hover:drop-shadow-xl hover:bg-${bgHoverColor}`}
        >
             {text}
        </button>
    );
};

export default LogoutButton;