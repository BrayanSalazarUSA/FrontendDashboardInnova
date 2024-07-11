  import React, { useContext, useState, useRef, useEffect } from "react";
  import { PersonalProfile } from "../components/PersonalProfile";
  import {
    ColumnDirective,
    ColumnsDirective,
    ContextMenu,
    GridComponent,
    Inject,
    Page,
    PdfExport,
    Resize,
  } from "@syncfusion/ej2-react-grids";
  import i18next from "i18next";
  import { Filter, Search, Sort } from "@mui/icons-material";
  import { propertiesGrid, userGrid } from "../data/dummy";
  import { useTranslation } from "react-i18next";
  import { useStateContext } from "../../context/ContextProvider";
  import { UserContext } from "../../context/UserContext";
  import { Button } from "primereact/button";
  import { getUserById } from "../helper/getUsersById";
  import GridPropertiesProfile from "../components/GridPropertiesProfile";

export const UserDatails = () => {

  const [userData, setUserData] = useState({ user: {} });
  const [window, setWindow] = useState(true);
  const { t, i18n } = useTranslation("global");
  const { userProvider, setUserProvider } = useContext(UserContext); 
  let user = JSON.parse(localStorage.getItem("user"));
  let userRole = user.role.rolName;    

    useEffect(() => {
      const fetchData = async () => {
        if (userProvider && userProvider.id) {
          const userDetails = await getUserById(userProvider.id);
          setUserData(userDetails);
        }
      };

    fetchData();
  }, [userProvider]);

  const [initialRolName, setInitialRolName] = useState('');

  useEffect(() => {
    if (userData && userData.user && userData.user.rol && userData.user.rol.rolName) {
      const translatedRolName = t(`dashboard.user-details.personal-profile.roles.${userData.user.rol.rolName}`);
      setInitialRolName(translatedRolName);
    }
  }, [userData, t]);

  return (
    <div className="bg-white w-full flex flex-col gap-5 px-4 md:px-8 md:flex-row text-[#161931]">
      <aside className="hidden py-4 min-w-[200px] md:w-1/3 lg:w-1/4 md:block">
        <div className="sticky flex flex-col gap-2 p-4 text-sm border-r border-indigo-100 top-12">
          <h2 className="pl-3 mb-4 text-2xl font-semibold">{t('dashboard.user-details.panel.panel')}</h2>
          <button onClick={() => setWindow(true)} className="flex items-center px-3 py-2.5 font-bold bg-white text-primary border rounded-full">
            {t('dashboard.user-details.panel.personal-profile')}
          </button>
          {userRole === "Admin" && (
            <button onClick={() => setWindow(false)} className="flex items-center px-3 py-2.5 font-semibold hover:text-primary hover:border hover:rounded-full">
              {t('dashboard.user-details.panel.properties')}
            </button>
          )}
        </div>
      </aside>
    
      {window ? (
        userData && (
          <PersonalProfile
            userProvider={userData.user}
            setUserProvider={setUserProvider}
            initialRolName={initialRolName}
            user={user}
            userRole={userRole}
          />
        )
      ) :
      
      (
        userData && (
            <GridPropertiesProfile 
            userId={userData.user.id} 
            setUserData={setUserData} />
        )
      )}
    </div>
  );
};

 

