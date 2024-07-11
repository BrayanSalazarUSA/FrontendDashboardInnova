import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { useTranslation } from "react-i18next";
import "../NotFound/NotFound.css";
import { Link } from "react-router-dom";

const NotFound = () =>{
    const [t] = useTranslation("global");
    return(
    <>
            <Navbar efecto="efecto2" />
            <section className="section">
                <div className="container px-4 py-20 mx-auto text-center mb-80">
                    <h1 className="titulo text-4xl md:text-5xl lg:text-6xl font-bold mb-4">{t("not_found.tittle")}</h1>
                    <div className="mt-2 flex justify-center">
                        <span className="inline-block w-20 h-2 bg-yellow-600 rounded-full mr-1"></span>
                        <span className="inline-block w-11 h-2 bg-yellow-600 rounded-full mr-1"></span>
                        <span className="inline-block w-9 h-2 bg-yellow-600 rounded-full"></span>
                    </div>
                    <p className="paragraph text-lg md:text-xl lg:text-2xl mt-4">{t("not_found.paragraph")}</p>
                    <p className="paragraph text-lg md:text-xl lg:text-2xl mt-12">{t("not_found.paragraph1")}</p>
                    <Link target="_top" to={"/"}>
                        <p className="paragraph2 text-lg md:text-xl lg:text-2xl mt-4 text-yellow-600 underline">{t("not_found.paragraph2")}</p>
                    </Link>
                </div>
            </section>
            <Footer />        
    </>   
    );
};

export default NotFound