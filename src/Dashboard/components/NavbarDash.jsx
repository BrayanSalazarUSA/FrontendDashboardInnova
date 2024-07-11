import React, { useEffect, useState } from 'react';
import { AiOutlineMenu } from 'react-icons/ai';
import { BsBuildings, } from 'react-icons/bs';
import { BsChatLeft } from 'react-icons/bs';
import { RiNotification3Line } from 'react-icons/ri';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { useTranslation, i18n } from "react-i18next";
import { Cart, Chat, Notification, UserProfile } from '.';
import { useStateContext } from '../../context/ContextProvider';
import { useNavigate } from "react-router-dom";
import { getPropertiesInfo } from '../helper/getProperties';

import { UserProvider } from '../../context/UserProvider';
import { styled } from '@material-ui/core';


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
  const userRole = userProfile.role.rolName; 
  const [properties, setProperties] = useState(userProfile.properties); 


  let link = userProfile.image?.split("/");
  let userImg = "";
  if (link) {
    let idImg = link[5] ? link[5] : "";
    userImg = "https://previews.123rf.com/images/anwarsikumbang/anwarsikumbang1502/anwarsikumbang150200446/36649713-hombre-avatar-de-dibujos-animados-imagen-usuario-personaje-ilustraci%C3%B3n-vectorial.jpg" + idImg;
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
  };

  useEffect(() => {
    // Función asíncrona para obtener las propiedades dependiendo del rol
    const fetchProperties = async () => {
      if (userRole === 'Admin' || userRole === 'Monitor') {
        const propertiesData = await getPropertiesInfo(navigate, userRole);
        setProperties(propertiesData); // Actualizamos el estado con todas las propiedades si es Admin o Monitor
      }
    };

    fetchProperties();
  }, [userRole, navigate]); 

  return (
    <div className="flex justify-between p-2 md:ml-6 md:mr-6 relative">
      <NavButton title="Menu" customFunc={handleActiveMenu} color={currentColor} icon={<AiOutlineMenu />} />
      <div className="flex">
        <button
          className="text-yellow-700 mx-2 hover:text-yellow-600"
          onClick={() => handleChangeLanguge("en")}
        >
          ENG
        </button>
        <button
          className=" text-yellow-700 hover:text-yellow-600"
          onClick={() => handleChangeLanguge("es")}
        >
          ESP
        </button>
        <NavButton title={t("dashboard.dashboard-navbar.cart.property")} customFunc={() => handleClick('cart')} color={currentColor} icon={<BsBuildings />} />
        {/* <NavButton title="Chat" dotColor="red" customFunc={() => handleClick('chat')} color={currentColor} icon={<BsChatLeft />} /> */}
        <TooltipComponent content="Profile" position="BottomCenter">
          <div className="flex items-center gap-2 cursor-pointer p-1 hover:bg-light-gray rounded-lg mt-2" onClick={() => handleClick('userProfile')}>
            <p className='p-0'>
              <span className="p-0 text-gray-400 text-14">{t("dashboard.dashboard-navbar.hi")}</span>{' '}
              <span className="p-0 text-gray-400 font-bold ml-1 text-14">
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