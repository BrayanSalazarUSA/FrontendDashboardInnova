import React from "react";
import consulting from "../../../assets/images/ServicesPages/Consulting/asesoria.webp";
import Navbar from "../../Navbar/Navbar";
import Footer from "../../Footer/Footer";
import { Link } from "react-router-dom";
import { Button2 } from "../../button/button";
import HeadShake from 'react-reveal/HeadShake';
import Fade from "react-reveal/Fade";
import Flash from 'react-reveal/Flash';
import { useTranslation } from "react-i18next";
import CTA from "../../CTA/CTA";
const Consulting = () => {
  const [t, i18n] = useTranslation("global");

  return (
    <>
      <Navbar efecto="efecto2"></Navbar>
      <section className="bg-white ">
        <div className="container px-6 py-10 mx-auto">
          <div className="lg:flex lg:items-center">
            <div className="w-full space-y-12 lg:w-1/2 ">
              <div>
                <HeadShake>
                  <h1 className="text-2xl font-semibold text-gray-800 capitalize lg:text-3xl ">
                    {t("consulting.title")}
                  </h1>
                </HeadShake>
                <div className="m">
                  <Fade left>
                    <span className="inline-block w-40 h-1 bg-yellow-600 rounded-full"></span>
                  </Fade>
                  <Fade left>
                    <span className="inline-block w-3 h-1 ml-1 bg-yellow-600 rounded-full"></span>
                  </Fade>
                  <Fade left>
                    <span className="inline-block w-1 h-1 ml-1 bg-yellow-600 rounded-full"></span>
                  </Fade>
                </div>
              </div>

              <div className="md:flex md:items-start md:-mx-4">
                <Fade left>
                  <span className="inline-block p-2 bg-yellow-600 bg-blue-100 rounded-xl md:mx-4 ">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                      />
                    </svg>
                  </span>
                </Fade>

                <div className="mt-4 md:mx-4 md:mt-0">
                  <h1 className="text-xl font-semibold text-gray-700 capitalize ">
                    <Fade left>
                      {t("consulting.Itemtitle1")}
                    </Fade>
                  </h1>
                  <Fade left>
                    <p className=" text-gray-500 p-2">{t("consulting.ItemDesc1")}</p>
                  </Fade>
                </div>
              </div>

              <div className="md:flex md:items-start md:-mx-4">
                <Fade left>
                  <span className="inline-block p-2 bg-yellow-600 bg-blue-100 rounded-xl md:mx-4  ">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                      />
                    </svg>
                  </span>
                </Fade>
                <div className=" md:mx-4 md:mt-0">
                  <h1 className="text-xl font-semibold text-gray-700 capitalize ">
                    <Fade left>
                      {t("consulting.Itemtitle2")}
                    </Fade>
                  </h1>
                  <Fade left>
                    <p className=" text-gray-500 p-2">{t("consulting.ItemDesc2")}</p>
                  </Fade>
                </div>
              </div>

              <div className="md:flex md:items-start md:-mx-4">
                <Fade left>
                <span className="inline-block p-2 bg-yellow-600 bg-blue-100 rounded-xl md:mx-4 ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"
                    />
                  </svg>
                </span>
                </Fade>

                <div className="md:mx-4 md:mt-0">
                  <Fade left>
                  <h1 className="text-xl font-semibold text-gray-700 capitalize ">
                    {t("consulting.Itemtitle3")}
                  </h1>
                  </Fade>
                  <Fade left>
                  <p className=" text-gray-500 p-2">{t("consulting.ItemDesc3")} </p>
                  </Fade>
                </div>
              </div>
            </div>

            <div className="hidden lg:flex lg:items-center lg:w-1/2 lg:justify-center">
              <Fade right>
              <img className="w-[28rem] h-[28rem] object-cover xl:w-[34rem] xl:h-[34rem] rounded-full" src={consulting} alt="consulting"/>
              </Fade>
            </div>
          </div>

          <hr className="my-2 border-gray-200 " />

          <div className="grid grid-cols-2 gap-8 md:grid-cols-6 lg:grid-cols-5"></div>
        </div>
      </section>

      <CTA></CTA>
      <Footer></Footer>
    </>
  );
};

export default Consulting;
