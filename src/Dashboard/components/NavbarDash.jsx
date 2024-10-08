import React, { useContext, useEffect, useState } from 'react';
import { AiOutlineMenu } from 'react-icons/ai';
import { BsBuildings, } from 'react-icons/bs';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { useTranslation, i18n } from "react-i18next";
import { Cart, Chat, Notification, UserProfile } from '.';
import { useStateContext } from '../../context/ContextProvider';
import { useNavigate } from "react-router-dom";
import { getPropertiesInfo } from '../helper/getProperties';

import { UserProvider } from '../../context/UserProvider';
import { styled } from '@material-ui/core';
import { UserContext } from '../../context/UserContext';


const NavButton = ({ title, customFunc, icon, color, dotColor }) => (

  <TooltipComponent content={title} position="BottomCenter">
    <button
      type="button"
      onClick={() => customFunc()}
      style={{ color }}
      className="relative text-xl rounded-full p-3 hover:bg-light-gray"
    >
      <span
        style={{ background: dotColor }}
        className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2"
      />
      {icon}
    </button>
  </TooltipComponent>
);

const Navbar = () => {
  const { currentColor, activeMenu, setActiveMenu, handleClick, isClicked, setScreenSize, screenSize } = useStateContext();
  const navigate = useNavigate(); 
  const userProfile = JSON.parse(localStorage.getItem("user"))
  const propertySelected = JSON.parse(localStorage.getItem("propertySelected"))
  const [properties, setProperties] = useState(userProfile.properties); 
 
  const { userContext, setUserContext, setUserLogged } =
  useContext(UserContext);
  
  // Primero intentamos obtener el roleName desde el localStorage
  let user = JSON.parse(localStorage.getItem("user") || '{}');
  const userRole = userProfile?.role?.rolName; 

// Si no se encuentra en el localStorage, lo buscamos en el userContext
if (!userRole && userContext && userContext.role) {
  console.log("No se ecnotró el role, configurando role del contexto")
  userRole = userContext.role.rolName;
}

 // Si el roleName no se encuentra, redirigimos al login
 if (!userRole) {
  alert('Role is not defined, redirecting to login.');
  navigate("/login");

}

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  useEffect(() => {
    if (screenSize <= 900) {
      setActiveMenu(false);
    } else {
      setActiveMenu(true);
    }
  }, [screenSize]);

  const handleActiveMenu = () => setActiveMenu(!activeMenu);
  const [t, i18n] = useTranslation("global");
  const handleChangeLanguge = (lang) => {
    i18n.changeLanguage(lang);
    console.log(lang)
  };

  useEffect(() => {
    // Función asíncrona para obtener las propiedades dependiendo del rol
    const fetchProperties = async () => {
      if (userRole === 'Admin' || userRole === 'Monitor' || userRole === 'Supervisor') {
        const propertiesData = await getPropertiesInfo(navigate, userRole);
        setProperties(propertiesData); // Actualizamos el estado con todas las propiedades si es Admin o Monitor
      }
    };
    fetchProperties();
  }, [userRole, navigate]); 

  return (
    <div className="flex justify-between px-2 md:ml-6 md:mr-6 relative">
      <NavButton title="Menu" customFunc={handleActiveMenu} color={currentColor} icon={<AiOutlineMenu />} />
      <div className="flex items-center">
      <div className="language-selector">
      <button
        className={`text-yellow-700 mx-2 hover:text-yellow-600 ${i18n.language === 'en' ? 'active' : ''}`}
        onClick={() => handleChangeLanguge('en')}
        disabled={i18n.language === 'en'}
      >
        <img src="https://upload.wikimedia.org/wikipedia/commons/f/fc/Flag_of_Great_Britain_%28English_version%29.png" alt="English" className="flag-icon" />
        En
      </button>
      <button
        className={`text-yellow-700 hover:text-yellow-600 ${i18n.language === 'es' ? 'active' : ''}`}
        onClick={() => handleChangeLanguge('es')}
        disabled={i18n.language === 'es'}
      >
        <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Bandera_nacional_de_Espa%C3%B1a.png" alt="Español" className="flag-icon" />
        Es
      </button>
    </div>
    <div onClick={() => handleClick('cart')} className='transition duration-300 ease-in-out hover:bg-gray-100 hover:shadow-md cursor-pointer flex items-center justify-start  mx-5 rounded-md  px-1'>
    <NavButton title={t("dashboard.dashboard-navbar.cart.property")}  color={currentColor} icon={<BsBuildings />} />
    <span className='p-0 text-gray-400 font-bold  text-14 '>{propertySelected?.name || "Properties"} <span>&#9660;</span></span>
    </div>
        {/* <NavButton title="Chat" dotColor="red" customFunc={() => handleClick('chat')} color={currentColor} icon={<BsChatLeft />} /> */}
        <TooltipComponent content="Profile" position="BottomCenter">
          <div className="flex items-center gap-2 cursor-pointer p-1  transition duration-300 ease-in-out hover:bg-gray-100 hover:shadow-md rounded-lg" onClick={() => handleClick('userProfile')}>
            <p className='p-0'>
              <span className="p-0 text-gray-400 text-14">{t("dashboard.dashboard-navbar.hi")}</span>{' '}
              <span className="p-0 text-gray-400 font-bold ml-1 text-14 ">
                {userProfile.name || ""}
              </span>
            </p>
            <MdKeyboardArrowDown className="text-gray-400 text-14" />
          </div>
        </TooltipComponent>
        {isClicked.cart && (<Cart properties={properties} />)} 
         {isClicked.chat && (<Chat />)}
        {/* {isClicked.notification && (<Notification />)} */}
        {isClicked.userProfile && (<UserProfile userProfile={userProfile} />)}
      </div>
    </div>
  );
};

export default Navbar;