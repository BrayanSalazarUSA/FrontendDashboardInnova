import React from "react";
import { useTranslation } from "react-i18next";

const FormLanguageSwitcher = () => {
    const { i18n } = useTranslation();
    const currentLanguage = i18n.language || window.localStorage.i18nextLng;

    
    const formSrc = currentLanguage.includes("es")
        ? "https://docs.google.com/forms/d/e/1FAIpQLSeehdqTdEk_eHXheSFZaLfRU0HtTtaNMkawvPTCM_tjtmSpCw/viewform?embedded=true"
        : "https://docs.google.com/forms/d/e/1FAIpQLSfcfz3GqZDJ06Fi4VzHn3gEJYOOnCkp9CQtsk8CsA98U9AbQw/viewform?embedded=true";
     
    return (
        <iframe
            src={formSrc}
            width="100%"
            height="600" 
           
            title="Contact Form"
        >
            Cargando…
        </iframe>
    );
};

export default FormLanguageSwitcher;
