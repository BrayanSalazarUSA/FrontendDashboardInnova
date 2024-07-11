import React, { useContext, useRef, useState } from 'react';
import { Steps } from 'primereact/steps';
import { Toast } from 'primereact/toast';
import { UserContext } from '../../../../context/UserContext';
import { useTranslation } from 'react-i18next';
import "./FooterReportForm.css";

export const FooterReportForm = ({ setInformation, activeIndex, setActiveIndex }) => {
    const { t } = useTranslation("global");
    const { reportForm } = useContext(UserContext);
    const toast = useRef(null);
    

    const showMessage = (field) => {
        toast.current.clear(); // Limpia todos los mensajes antes de mostrar uno nuevo
        toast.current.show({
            severity: 'error',
            summary: t('Error'),
            detail: t(`dashboard.reports.new-report.error.${field}`),
            life: 3000
        });
    };
    

    // Valida que todos los campos requeridos en reportForm no estén vacíos
    const validateForm = () => {
        console.log('Validating form with values: ', reportForm);
        const requiredFields = [
            'property'
        ];
        for (const field of requiredFields) {
            const value = reportForm[field];
            if (value === null || value === undefined || (typeof value === 'string' && value.trim() === '')) {
                showMessage(field); // Muestra el mensaje para el campo específico
                return false; // Retorna después de la primera validación fallida
            }
            // Si el campo es un objeto (como date), puedes querer hacer una validación adicional aquí
        }
        return true; 
    };


    const handleStepChange = (index) => {
        if (activeIndex === index) {
            return;
        }
        if (index === 1 && !validateForm()) {
            return;
        }
        setActiveIndex(index); // Cambia el paso usando el prop
        setInformation(index === 0); // Controla qué formulario mostrar
    };



    const items = [
        {
            label: t("dashboard.reports.new-report.footer.information"),
            command: () => handleStepChange(0)
        },
        {
            label: t("dashboard.reports.new-report.footer.evidences"),
            command: () => handleStepChange(1)
        },
    ];

    return (
        <div className="card">
            <Toast ref={toast} />
            <Steps model={items} activeIndex={activeIndex} onSelect={(e) => handleStepChange(e.index)} readOnly={false} />
        </div>
    );
};