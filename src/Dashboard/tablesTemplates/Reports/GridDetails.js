import React from "react";
import { Link } from "react-router-dom";
import { HiOutlineEye } from "react-icons/hi";


// Plantilla para ir a los detalles del reporte
export const GridDetails = (props) => {
    const { id, refreshReports } = props; 

    // React.useEffect(() => {
    //     refreshReports();
    // }, []);
    return (
        <Link
            className="flex justify-center m-0 p-0"
            to={`/dashboard/report-details/${id}`}
        >
            <HiOutlineEye className="text-lg "></HiOutlineEye>
        </Link>
    );
};