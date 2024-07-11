import React from "react";

import "../../pages/css/Reports/Stats.css";
import { AiOutlineLineHeight, AiOutlineLink, AiOutlinePlusCircle } from "react-icons/ai";
import ChartImg from "../../../assets/chartsSvg.svg";

const NoReports = () => {
  return (
    <div className="no-reports-container flex flex-col justify-center items-center">
      <h2 className="text-2xl text">No Se Encotraron Reportes</h2>
      <p>
        Asegúrese en la vista de reportes si tenga reportes para esta propiedad.
      </p>
      <img className="mx-auto" width={400} src={ChartImg} alt="Chart Image"/>
  </div>
  );
};

export default NoReports;
