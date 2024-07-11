import React, { useEffect, useState, useRef, useContext } from "react";
import { MdOutlineCancel } from "react-icons/md";
import { useNavigate } from "react-router-dom"; 
import { Button } from "..";
import { useStateContext } from "../../../context/ContextProvider";
import { UserContext } from "../../../context/UserContext"; 
import useUserProfileData from "../UserProfileData";
import Shortlogo from "../../../assets/images/Logos/Logo-short.png"
import LogoutButton from "../LogoutButton";
import { useTranslation } from "react-i18next"; 
import './UserProfile.css'
import useOutsideClick from "../../Hooks/useOutsideClick";
import useHandleProfileClick from "../../Hooks/useHandleProfileClick";

const UserProfile = ({ userProfile }) => {
  const { currentColor } = useStateContext();
  
  const [t] = useTranslation("global");
  let roleName = userProfile.role;  
 
  const [propertyFetched, setPropertyFetched] = useState({});
  
  const translatedUserProfileData = useUserProfileData();

  const userRef = useRef();
  const { setIsClicked } = useStateContext();
  useOutsideClick(userRef, () => setIsClicked(prev => ({ ...prev, userProfile: false })));
 
  const handleProfileClick = useHandleProfileClick();

  let userImg = `${process.env.REACT_APP_S3_BUCKET_URL}/${userProfile.image}`
  if(userProfile.image == null || userProfile.image === ""){
  userImg ="https://static-00.iconduck.com/assets.00/user-avatar-1-icon-511x512-ynet6qk9.png"
 }
  return (
    <div ref={userRef} className="nav-item absolute right-1 top-16 bg-white dark:bg-[#42464D] p-8 rounded-lg w-96">
      <div className="flex justify-between items-center">
        <img style={{ height: '10%', width: '10%', marginLeft: '10%', marginRight: '-15%' }} src={Shortlogo} alt="Logo" /><p className="font-semibold text-lg dark:text-gray-200">Innova Monitoring</p>
        <Button
          icon={<MdOutlineCancel />}
          color="rgb(153, 171, 180)"
          bgHoverColor="light-gray"
          size="2xl"
          borderRadius="50%"
        />
      </div>
      <div className="flex gap-5 items-center mt-6 border-color border-b-1 pb-6">
        <img
          className="rounded-full h-24 w-24 userimg"
          src={userImg}

          alt="user-profile"
        />
        <div>
          <p className="font-semibold text-xl dark:text-gray-200">
            {userProfile.name}
          </p>
          <p className="text-gray-500 text-sm dark:text-gray-400">
            {userProfile.role ? userProfile.role.rolName : ""}
          </p>
          <p className="text-gray-500 text-sm font-semibold dark:text-gray-400">
            {userProfile.email}
          </p>

        </div>
      </div>
      <div>
        {translatedUserProfileData.map((item, index) => (
          <div
            key={index}
            className={`flex gap-5 border-b-1 border-color p-4 cursor-pointer dark:hover:bg-[#42464D] ${item.hoverClass}`}
            onClick={() => handleProfileClick(userProfile)}
          >
            <button
              type="button"
              style={{ color: item.iconColor, backgroundColor: item.iconBg }}
              className=" text-xl rounded-lg p-3 hover:bg-light-gray"
            >
              {item.icon}
            </button>

            <div>
              <p className="font-semibold dark:text-gray-200 ">{item.title}</p>
              <p className="text-gray-500 text-sm dark:text-gray-400">
                {" "}
                {item.desc}{" "}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5">
        <LogoutButton
          color="white"
          bgColor={currentColor}
          text={t("dashboard.dashboard-navbar.user-profile.logout-button")}
          borderRadius="10px"
          width="full"
        />
      </div>
    </div>
  );
};

export default UserProfile;

