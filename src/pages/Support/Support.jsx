import React, { useState } from "react";
import { FormButton } from "../../components/button/button";
import "./Support.css";
import support from "../../assets/images/Pages/Support/support.png";
import Navbar from "../../components/Navbar/Navbar";
import Reveal from "react-reveal/Reveal";
import { Link } from "react-router-dom";
import Fade from "react-reveal/Fade";
import Footer from "../../components/Footer/Footer";
import { useTranslation } from "react-i18next";
import DynamicSupportForm from "../../components/DynamicSupportForm/DynamicSupportForm";

const Support = () => {
  const {t} = useTranslation("global");
  const [showForm, setShowForm] = useState(false);
  const handleButtonClick = () => {
    setShowForm(prevShowForm => !prevShowForm); // Alternar el estado entre true y false
  };
  return (
    <>
        <Navbar efecto="efecto2"></Navbar>
        <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <Fade left>
                <p className="inline-block px-1 py-px mb-4 text-xs font-semibold tracking-wider text-yellow-600 uppercase rounded-full bg-teal-accent-400 tamaño">
                  {t("support1.prev")}
                </p>
                <h2 className="max-w-lg text-3xl font-bold  text-gray-700 sm:text-4xl ">
                  {t("support1.title")}
                </h2>

                <Reveal>
                  <p className="text-base py-4 text-gray-700 md:text-lg">
                    {t("support1.desc")}
                  </p>
                </Reveal>
              </Fade>
              <ul className="grid grid-cols-1 mt-4 sm:mt-10 sm:grid-cols-2 gap-x-10 xl:gap-x-16 gap-y-4 xl:gap-y-6">
                <Fade left>
                  <li className="flex items-center">
                    <svg
                      className="flex-shrink-0 w-5 h-5 text-yellow-600"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="ml-3 font-medium text-gray-700">
                      {" "}
                      {t("support1.01")}
                    </span>
                  </li>
                </Fade>
                <Fade right>
                  <li className="flex items-center">
                    <svg
                      className="flex-shrink-0 w-5 h-5 text-yellow-600"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="ml-3 font-medium text-gray-70">
                      {" "}
                      {t("support1.02")}
                    </span>
                  </li>
                </Fade>
                <Fade left>
                  <li className="flex items-center">
                    <svg
                      className="flex-shrink-0 w-5 h-5 text-yellow-600"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="ml-3 font-medium text-gray-70">
                      {" "}
                      {t("support1.03")}
                    </span>
                  </li>
                </Fade>
                <Fade right>
                  <li className="flex items-center">
                    <svg
                      className="flex-shrink-0 w-5 h-5 text-yellow-600"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="ml-3 font-medium text-gray-70">
                      {" "}
                      {t("support1.04")}
                    </span>
                  </li>
                </Fade>
                <Fade left>
                  <li className="flex items-center">
                    <svg
                      className="flex-shrink-0 w-5 h-5 text-yellow-600"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="ml-3 font-medium text-gray-700">
                      {t("support1.05")}
                    </span>
                  </li>
                </Fade>
                <Fade right>
                  <li className="flex items-center">
                    <svg
                      className="flex-shrink-0 w-5 h-5 text-yellow-600"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="ml-3 font-medium text-gray-70">
                      {" "}
                      {t("support1.06")}
                    </span>
                  </li>
                </Fade>
              </ul>

                <Fade bottom>
                <FormButton text="buttons.talk" onClick={handleButtonClick}></FormButton>
                </Fade>
            </div>
            <div className="md:w-1/2">
              <DynamicSupportForm showForm={showForm} />
            </div>
          </div>
        </div>
      </section>
      <Footer></Footer>
    </>
  );
};
export default Support;
