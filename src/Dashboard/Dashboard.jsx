import React, { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import "./style.css";
import Sidebar from "./components/Sidebar/Sidebar.jsx";
import { FooterDash, NavbarDash } from "./components";
import { UserContext } from "../context/UserContext";
import { useStateContext } from "../context/ContextProvider";
import useFetchProperty from "./Hooks/useFetchProperty";

const Dashboard = () => {
  const { activeMenu } = useStateContext();
  const { propertyContext, setPropertyContext } = useContext(UserContext);
  const navigate = useNavigate();

  const propertyStorage = JSON.parse(localStorage.getItem("propertySelected"));
  const propertyId = propertyStorage ? propertyStorage.id : 1;
  const { property, isLoading } = useFetchProperty(propertyId, navigate);


  useEffect(() => {
    if (property && Object.keys(propertyContext).length === 0 && Object.keys(property).length > 0) {
      setPropertyContext(property);
    }
    if (!propertyId) {
      navigate("/");
    }
  }, [property, propertyContext, setPropertyContext, navigate, propertyId]);

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'user' && !event.newValue) {
        navigate('/login');
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [navigate]);

  return (
    <div className="flex relative dark:bg-main-dark-bg w-screen">
      {activeMenu ? (
        <div className="w-1/5 fixed sidebar dark:bg-secondary-dark-bg bg-white ">
          <Sidebar />
        </div>
      ) : (
        <div className="w-0 dark:bg-secondary-dark-bg">
          <Sidebar />
        </div>
      )}
      <div
        className={
          activeMenu
            ? "dark:bg-main-dark-bg  bg-main-bg min-h-screen md:ml-[20%] w-4/5"
            : "bg-main-bg dark:bg-main-dark-bg min-h-screen flex-2 w-full"
        }
      >
        <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg ">
          <NavbarDash />
        </div>
        {/* {themeSettings && (<ThemeSettings />)} */}
       
          <Outlet />
      
        <FooterDash/>
      </div>
    </div>
  );
};

export default Dashboard;