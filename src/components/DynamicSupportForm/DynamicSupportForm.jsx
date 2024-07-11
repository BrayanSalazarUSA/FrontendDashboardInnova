import React from 'react';
import { useTranslation } from 'react-i18next';
import './DynamicSupportForm.css';
import support from '../../assets/images/Pages/Support/support.png';

const DynamicSupportForm = ({ showForm }) => {
    const { i18n } = useTranslation();
    const formSrcEs = "https://docs.google.com/forms/d/e/1FAIpQLScxjAXdtNihuJkgrdEx08TxolK1kZuQu7rU-fp29rzSbNYvmw/viewform?embedded=true"; // URL del formulario en español
    const formSrcEn = "https://docs.google.com/forms/d/e/1FAIpQLScM56IvACXJSEKYrg-4bR0vSxzzR0bqlTUdr8-ExZRC4423CQ/viewform?embedded=true"; // URL del formulario en inglés
    const formSrc = i18n.language.includes('es') ? formSrcEs : formSrcEn;

    return (
        <div>
            <img
                src={support}
                alt="Support"
                className={`support-content support-image ${showForm ? 'oculto' : ''}`}
            />
            <iframe
                src={formSrc}
                width="100%"
                height="600"
                frameBorder="0"
                marginHeight="0"
                marginWidth="0"
                title="Dynamic Form"
                className={`support-content ${showForm ? '' : 'oculto'}`}
            >
                Cargando…
            </iframe>
        </div>
    );
};

export default DynamicSupportForm;
