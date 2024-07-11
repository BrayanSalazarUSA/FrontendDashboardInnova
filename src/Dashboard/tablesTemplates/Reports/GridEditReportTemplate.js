import {  useNavigate } from "react-router-dom";
import React, { useContext } from "react";
import { AiFillEdit } from "react-icons/ai";
import { UserContext } from "../../../context/UserContext"; 


export const GridEditReportTemplate = (props) => {

    const { setReportForm } = useContext(UserContext);
    const navigate = useNavigate();
    
    const {  refreshReports } = props

   

    const handleEditClick = () => {
        const parseDate = (dateStr) => {
            if (!dateStr) return null;
            const [month, day, year] = dateStr.split('-');
            return new Date(year, month - 1, day);
        };

        const parseTime = (timeStr, dateStr) => {
            if (!timeStr || !dateStr) return null;
            const [hours, minutes] = timeStr.split(':');
            const [month, day, year] = dateStr.split('-');
            return new Date(year, month - 1, day, hours, minutes);
        };

        const formattedProps = {
            ...props,
            dateOfReport: parseDate(props.dateOfReport),
            timeOfReport: parseTime(props.timeOfReport, props.dateOfReport),
            incidentDate: parseDate(props.incidentDate),
            incidentStartTime: parseTime(props.incidentStartTime, props.incidentDate),
            incidentEndTime: parseTime(props.incidentEndTime, props.incidentDate)
        };
        console.log("GridEditReportTemplate props:", props);

        setReportForm(formattedProps);
        navigate('/dashboard/EditReport');
    };

    if (!props || !props.id) {
        return <div className="flex justify-center"><p>No hay datos</p></div>;
    }

    return (
        <div className="flex justify-center m-0 p-0 cursor-pointer" onClick={handleEditClick}>
            <AiFillEdit className="text-lg" />
        </div>
    );
};