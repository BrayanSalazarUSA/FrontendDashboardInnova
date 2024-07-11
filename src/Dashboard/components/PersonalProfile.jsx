import { Dropdown } from "primereact/dropdown";
import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { InputTextarea } from "primereact/inputtextarea";
import { UserContext } from "../../context/UserContext";
import { getRoles } from "../helper/getRoles";
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { putUserImg } from "../helper/userProfile/PersonalProfile/putUserImg";
import { putUserInfo } from "../helper/userProfile/PersonalProfile/putUserInfo";


export const PersonalProfile = ({ userProvider, setUserProvider, initialRolName, user, userRole }) => {

  const [t, i18n] = useTranslation("global");
  const [roles, setRoles] = useState([]);

  const [showPasword, setShowPasword] = useState(false);
  const { name, rol, image } = userProvider;
  
  const [selectedRoleId, setSelectedRoleId] = useState(userProvider.rol?.rolKey);
  const [tempRole, setTempRole] = useState(null);

  const isEditableByClientAndAdmin = userRole === "Admin" || userRole === "Client";
  const isEditableOnlyByAdmin = userRole === "Admin";
  const canChangePassword = userRole !== "Monitor";

  const fileInputRef = useRef();

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const updatedUser = await putUserImg(userProvider.id, file, t);
        if (updatedUser) {
          setUserProvider(updatedUser); // Esto actualizará el estado y causará un re-render
        }
      } catch (error) {
        console.error('Failed to update user image:', error);
      }
    }
  };


  const [input, setInput] = useState({
    name: userProvider.name,
    email: userProvider.email,
    password: userProvider?.password,
    rol: userProvider.rol
  });

  const resetInput = () => {
    setInput({
      name: userProvider.name,
      email: userProvider.email,
      password: userProvider?.password,
      rol: userProvider.rol
    });
  };

  useEffect(() => {
    resetInput();
  }, [userProvider]);




  const handleInputChange = (field) => (event) => {
    setInput(prev => ({ ...prev, [field]: event.target.value }));
  };


  const togglePaswordVisibility = () => {
    setShowPasword(!showPasword);
  };

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const rolesData = await getRoles();
        const rolesArray = rolesData.map(({ id, rolName }) => ({
          rolKey: id,
          rolName: t(`dashboard.users.dialog-add-user.roles.roles-dropdown.${rolName}`),
          originalName: rolName
        }));
        setRoles(rolesArray);

        if (userProvider && userProvider.rol && userProvider.rol.id) {
          setSelectedRoleId(userProvider.rol.id);
        }
      } catch (error) {
        console.error('Failed to fetch roles:', error);
      }
    };

    fetchRoles();
  }, [t, userProvider]);


  const onRoleChange = (e) => {
    setSelectedRoleId(e.value);
    const selectedRole = roles.find(role => role.rolKey === e.value);
    if (selectedRole) {
      setTempRole(selectedRole.originalName);
      setInput(prev => ({ ...prev, rol: selectedRole }));
    }
  };

  console.log(userProvider.id)

  const handleSaveClick = async () => {
    console.log('Current form values:', input);

    try {
      const updatedUser = await putUserInfo(input, userProvider.id, t);
      console.log('Updated User:', updatedUser);
      if (updatedUser) {
        setUserProvider(updatedUser);
      }
    } catch (error) {
      console.error('Failed to update user info:', error);
    }

  };


  let userImg = `${process.env.REACT_APP_S3_BUCKET_URL}/${image}`
  if (image == null || user.image === "") {
    userImg = "https://static-00.iconduck.com/assets.00/user-avatar-1-icon-511x512-ynet6qk9.png"
  }


  return (
    <main className="w-full min-h-screen py-1 md:w-2/3 lg:w-3/4">
      <div className="p-2 md:p-4">
        <div className="w-full px-6 pb-8 mt-8 sm:max-w-xl sm:rounded-lg">
          <h2 className="pl-6 text-3xl text-primary font-bold sm:text-xl">{name}</h2>
          {/* este titulo viene desde UserDatails para evitar el cuando se recargue el rol del usuario este titulo cambie*/}
          <h2 className="pl-6 text-2xl sm:text-xl">{initialRolName}</h2>
          <div className="grid max-w-2xl mx-auto mt-4">
            <div className="flex flex-col items-center space-y-5 sm:flex-row sm:space-y-0">
              <img className="object-cover w-40 h-40 p-1 rounded-full ring-2 ring-[#f5b73293] dark:ring-indigo-500"
                src={userImg}
                alt="Bordered avatar" />

              {isEditableByClientAndAdmin && (

                <div className="flex flex-col space-y-5 sm:ml-8">
                  <button
                    type="button"
                    className="py-3.5 px-7 text-base font-medium text-indigo-100 focus:outline-none bg-[#c2880b] rounded-lg border border-[#f5b73293] hover:bg-indigo-900 focus:z-10 focus:ring-4 focus:ring-indigo-200"
                    onClick={() => fileInputRef.current.click()}
                  >
                    {t('dashboard.user-details.personal-profile.change-picture')}
                    <input
                      ref={fileInputRef}
                      type="file"
                      style={{ display: 'none' }}
                      accept="image/*"
                      onChange={handleFileChange}
                      fileInputRef 
                    />
                  </button>
            
                </div>
              )}
            </div>

            <div className="items-center mt-8 sm:mt-14 text-[#202142]">
              <div
                className="flex flex-col items-center w-full mb-2 space-x-0 space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0 sm:mb-6">
                <div className="w-full">
                  <label htmlFor="name"
                    className="block mb-2 text-sm font-medium text-primary dark:text-white">{t(`dashboard.user-details.personal-profile.name`)}</label>
                  <input
                    type="text"
                    id="name"
                    className="bg-indigo-50 border border-indigo-300 text-primary text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                    placeholder={t("dashboard.user-details.personal-profile.name-placeholder")}
                    value={input.name}
                    onChange={handleInputChange('name')}
                    required
                    disabled={!isEditableOnlyByAdmin}  

                  />
                </div>
              </div>

              <div className="mb-2 sm:mb-6">
                <label htmlFor="email"
                  className="block mb-2 text-sm font-medium text-primary dark:text-white">
                  {t(`dashboard.user-details.personal-profile.email`)}</label>
                <input type="email" id="email"
                  className="bg-indigo-50 border border-indigo-300 text-primary text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  placeholder={t("dashboard.user-details.personal-profile.email-placeholder")}
                  value={input.email}
                  onChange={handleInputChange('email')}
                  required 
                  disabled={!isEditableOnlyByAdmin}/>
                  
              </div>

              <div className="mb-2 sm:mb-6">
                <label htmlFor="password"
                  className="block mb-2 text-sm font-medium text-primary dark:text-white"> {t(`dashboard.user-details.personal-profile.password`)}</label>
                <input
                  type={showPasword ? "text" : "password"}
                  id="password"
                  className="bg-indigo-50 border border-indigo-300 text-primary text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  placeholder={t("dashboard.user-details.personal-profile.password-placeholder")}
                  value={input?.password}
                  onChange={handleInputChange('password')}
                  required
                  disabled={!canChangePassword} 
                />
                <button onClick={togglePaswordVisibility} className="mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-500">
                  {showPasword ? t('dashboard.user-details.personal-profile.hide-password') : t('dashboard.user-details.personal-profile.show-password')}
                </button>
              </div>


              <div className=" w-7/12 ">
                {isEditableOnlyByAdmin && (
                    <Dropdown
                    value={selectedRoleId}
                    options={roles}
                    onChange={onRoleChange}
                    optionLabel="rolName"
                    optionValue="rolKey"
                    placeholder={t("dashboard.users.dialog-add-user.roles.select-rol")}
                    className="w-full"
                  />

                )}
              </div>

              {isEditableByClientAndAdmin && (
              <div className="flex justify-end">
                <button type="submit"
                  className="text-white bg-indigo-700  hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
                  onClick={handleSaveClick}>

                  {t("dashboard.user-details.personal-profile.save")}
                </button>
              </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

