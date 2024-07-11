// Plantilla para mostrar el estado del reporte y actualizar su estado
import React from "react";
import { useTranslation } from "react-i18next";
import {  AiFillCheckCircle } from "react-icons/ai";
import { TiDeleteOutline } from "react-icons/ti";
import { toggleReportVerification } from "../../helper/toggleReportVerification";

export const GridIVoidedReport = (props ) => {
    const [t, i18n] = useTranslation("global");
    const {id, verified: initialVerified, refreshReports } = props
    const [verified, setVerified] = React.useState(initialVerified);


    React.useEffect(() => {
        setVerified(initialVerified);
    }, [initialVerified]);

    const handleToggleVerification = async () => {
        if (verified) {
            const newVerifiedStatus = await toggleReportVerification(id, verified, t);
            setVerified(newVerifiedStatus);
        }
    };


    return (
        <div key={Math.random()} className="flex justify-center m-0 p-0 text-lg cursor-pointer" onClick={handleToggleVerification}>
            {verified ? (
                <AiFillCheckCircle className="text-green-600" />
            ) : (
                <TiDeleteOutline className="text-red-600" />
            )}
        </div>
    );
};