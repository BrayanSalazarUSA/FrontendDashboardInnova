import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "../../components/Navbar/Navbar";
import { getUser } from "../../Dashboard/helper/getUser";
import { UserContext } from "../../context/UserContext";
import "./Login.css";
import logo from "../../assets/images/Logos/innova-monitoring.png";
import Swal from "sweetalert2";
import Reveal from "react-reveal/Reveal";
import { Link } from "react-router-dom";
import { a } from "react-spring";

const Login = () => {
 
  const [width, setWidth] = useState(window.innerWidth);
  const navigate = useNavigate();
  const [t, i18n] = useTranslation("global");
  const { userContext, setUserContext, userLogged, setUserLogged } =
    useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  let newUser = null;
  const [showPassword, setShowPassword] = useState(false);


  useEffect(() => {
    localStorage.clear("propertySelected");
    localStorage.clear("user");
  }, [])
  

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    if (email === "" || password === "") {
      setError(true);
      return;
    }
    const user = {
      email: email,
      password: password,
    };

    try {
      const newUser = await getUser(user);
      console.log(newUser);

      if (newUser && newUser.email) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            image: newUser.image,
            role: newUser.rol,
            properties: newUser.properties,
          })
        );

        // Actualiza el contexto de usuario con la nueva información

        setUserContext({
          ...userContext,
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          image: newUser.image,
          role: newUser.rol,
          properties: newUser.properties,
        });

      if (newUser.properties && newUser.properties.length > 0) {
          localStorage.setItem(
            "propertySelected",
            JSON.stringify(newUser.properties[0])
          );
          setUserLogged(true); 

          /* El id del monitor debe ser 3 siempre */
        if (newUser.rol.id === 3) {
  
            let ipData = await fetch("https://api.ipify.org/?format=json");
            const ip = await ipData.json();
            const param = { ip: ip.ip };
            // Construir la URL con los parámetros
          const baseUrl = `${process.env.REACT_APP_SERVER_IP}/networks`;
            const url = new URL(baseUrl);
            url.search = new URLSearchParams(param).toString();

            let response = await fetch(url, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            });

            let data = await response.json();
            console.log(data.isApproved);
            if(!data.isApproved){
              Swal.fire(
                "Info",
              "Lo siento, no tienes acceso al IDS en este momento, tu red no esta registrada en nuestro sistema",
                "info"
              );
              
              navigate("/");
              return;
            } 
          }
          
          navigate("/dashboard");
        } else {
          Swal.fire(
            "Info",
            t("login.swal-fire.properties-don't-assigned"),
            "info"
          );
          navigate("/");
        }
      } else {
        Swal.fire("Info", "El usuario no existe en la base de datos ", "info");
        navigate("/");
      }
    } catch (error) {
      setError(true);
      Swal.fire("Error", error.toString(), "error");
    }
  };

  return (
    <>
      <Navbar efecto="efecto2"></Navbar>
      <div className="bg-white my-8">
        <div className="flex justify-center h-screen">
          <Reveal>
            <div className="hidden bg-cover lg:block lg:w-3/5 photo-login img-container">
              <div className="flex items-center h-full px-20 ">
                <div>
                  <p className=" text-3xl font-bold tracking-tight text-yellow-600 sm:text-4xl text-center">
                    {t("login.IDS")}
                  </p>

                  <p className="max-w-xl mt-3 text-gray-300 text-center">
                    {t("login.text")}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          <div className="flex items-center w-full max-w-md px-6 mx-auto lg:w-2/6">
            <div className="flex-1">
              <div className="text-center">
                <div className="flex justify-center mx-auto">
                  <img
                    className="h-52 w-52"
                    src={logo}
                    alt="Innova Monitoring"
                  />
                </div>
                <p className="mt-3 text-gray-500 p-0">
                  {t("login.header_sign_in")}
                </p>
              </div>

              <div className="mt-8">
                <form>
                  <div>
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm text-gray-600 "
                    >
                      {t("login.email")}
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      placeholder={t("login.email_placeholder")}
                      value={email}
                      required
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg  focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                    />
                  </div>

                  <div className="mt-6">
                    <div className="flex justify-between items-center mb-2">
                      <label
                        htmlFor="password"
                        className="text-sm text-gray-600"
                      >
                        {t("login.password")}
                      </label>
                      <p
                        href="#"
                        className="text-sm text-gray-400 focus:text-blue-500 hover:text-blue-500 hover:underline"
                      >
                        {t("login.forgot_password")}
                      </p>
                    </div>

                    <div id="login-form" className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        id="password"
                        placeholder={t("login.password_placeholder")}
                        value={password}
                        required
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40 pr-10"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <i className="mdi mdi-eye-off"></i>
                        ) : (
                          <i className="mdi mdi-eye"></i>
                        )}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="mt-6 text-red-700">
                      {t("login.required_fields")}
                    </div>
                  )}

                  <div className="mt-6">
                    <button
                      type="submit"
                      onClick={handleOnSubmit}
                      className="w-full px-4  py-2 tracking-wide text-white transition-colors duration-300 transform bg-yellow-600 rounded-lg hover:bg-blue-400 focus:outline-none focus:bg-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                    >
                      {t("login.sign_in")}
                    </button>
                  </div>
                </form>

                <p className="mt-6 text-sm text-center text-gray-400">
                  {t("login.acount_yet")}
                  <br></br>
                  <Link
                    to="/plan"
                    className="text-yellow-600 focus:outline-none focus:underline hover:underline"
                  >
                    {t("login.join_us")}
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
