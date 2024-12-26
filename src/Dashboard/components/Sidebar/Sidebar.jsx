import React, { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { SiShopware } from "react-icons/si";
import { MdOutlineCancel } from "react-icons/md";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import Logo from "../../../assets/images/Logos/Logo-short.png";
import SidebarLinks from "../../data/sliderbar";
import { useStateContext } from "../../../context/ContextProvider";
import { UserProvider } from "../../../context/UserProvider";
import { FiShoppingBag } from "react-icons/fi";
import { BiLogOut } from "react-icons/bi";
import { useTranslation } from "react-i18next";
import "./Siderbar.css";
import { UserContext } from "../../../context/UserContext";

const Sidebar = () => {
  const { currentColor, activeMenu, setActiveMenu, screenSize } =
    useStateContext();

  const navigate = useNavigate();
  const { userContext } = useContext(UserContext);

  // Primero intentamos obtener el roleName desde el localStorage
  let user = JSON.parse(localStorage.getItem("user") || "{}");
  let userRole = user?.role?.rolName;

  // Si no se encuentra en el localStorage, lo buscamos en el userContext
  if (!userRole && userContext && userContext.role) {
    console.log("No se ecnotró el role, configurando role del contexto");
    userRole = userContext.role.rolName;
  }

  // Si el roleName no se encuentra, redirigimos al login
  if (!userRole) {
    alert("Role is not defined, redirecting to login.");
    navigate("/login");
  }

  const handleCloseSideBar = () => {
    if (activeMenu !== undefined && screenSize <= 900) {
      setActiveMenu(false);
    }
  };

  const logout = () => {
    localStorage.setItem("user", JSON.stringify({}));
    localStorage.setItem("propertySelected", JSON.stringify({}));
    navigate("/");
  };

  const activeLink =
    "flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg  text-white  text-md m-2 ";
  const normalLink =
    "flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-md text-gray-700 dark:text-gray-200 dark:hover:text-black hover:bg-light-gray m-2  ";

  const links = SidebarLinks();
  const [t, i18n] = useTranslation("global");

  const [showImage, setShowImage] = useState(false);
  const [textVisibility, setTextVisibility] = useState("hidden");

  React.useEffect(() => {
    const animate = () => {
      setShowImage(false); // Asegura que la imagen esté oculta inicialmente
      setTimeout(() => {
        setShowImage(true); // Activa la animación de la imagen
        setTimeout(() => {
          setShowImage(false); // Desactiva la animación de la imagen
          setTextVisibility(true); // Activa la animación del texto
        }, 1000); // Tiempo después de que termina la animación de la imagen
      }, 100); // Tiempo antes de iniciar la animación de la imagen
    };

    animate();
    const interval = setInterval(animate, 13000); // Tiempo total del ciclo de animación
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="ml-3 h-screen overflow-hidden overflow-y-auto pb-10">
      {activeMenu && (
        <>
          <div className="flex justify-center items-start flex-col w-full">
            <div className="flex flex-row justify-start items-center mt-4 mb-4">
              <img
                className={`logodash ${showImage} logodash.animate-assembleImage`}
                src={Logo}
                alt="Logo"
              />
              <h1 className="font-extrabold text-xl leading-none text-gray-900">
                Innova <br /> Monitoring IDS
              </h1>
            </div>

            <TooltipComponent content="Menu" position="BottomCenter">
              <button
                type="button"
                onClick={() => setActiveMenu(!activeMenu)}
                style={{ color: currentColor }}
                className="text-xl rounded-full p-3 hover:bg-light-gray mt-4 block md:hidden"
              >
                <MdOutlineCancel />
              </button>
            </TooltipComponent>
          </div>
          <div className="mt-2">
            {links.map((item) => (
              <div key={item.url}>
                <p className="text-gray-400 p-0 dark:text-gray-400 m-3 mt-4 uppercase">
                  {item.title}
                </p>
                {item.links.map((link) => {
                  if (link.permit === "Yes") {
                    return (
                      <NavLink
                        to={`/dashboard/${link.url}`}
                        key={link.name}
                        onClick={handleCloseSideBar}
                        style={({ isActive }) => ({
                          backgroundColor: isActive ? currentColor : "",
                        })}
                        className={({ isActive }) =>
                          isActive ? activeLink : normalLink
                        }
                      >
                        {link.icon}
                        <span className="">{link.name}</span>
                      </NavLink>
                    );
                  } else {
                    if (userRole === "Admin") {
                      return (
                        <NavLink
                          to={`/dashboard/${link.url}`}
                          key={link.name}
                          onClick={handleCloseSideBar}
                          style={({ isActive }) => ({
                            backgroundColor: isActive ? currentColor : "",
                          })}
                          className={({ isActive }) =>
                            isActive ? activeLink : normalLink
                          }
                        >
                          {link.icon}
                          <span className=" ">{link.name}</span>
                        </NavLink>
                      );
                    } else {
                      return <React.Fragment key={link.name} />;
                    }
                  }

                  return <React.Fragment key={link.name} />;
                })}
              </div>
            ))}

            <div
              onClick={logout}
              className="flex cursor-pointer items-center gap-5 pl-4 pt-3  rounded-lg text-md text-gray-700 dark:text-gray-200 dark:hover:text-black hover:bg-light-gray m-2"
            >
              <BiLogOut />
              <span className="capitalize ">
                {t(
                  "dashboard.dashboard-sliderbar.graphical-insights-section.logout"
                )}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
