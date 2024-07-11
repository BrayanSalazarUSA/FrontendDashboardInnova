import React, { useContext, useState } from "react";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { UserContext } from "../../../context/UserContext";
import { useTranslation } from "react-i18next";

export const ReportForm = ({properties, agents, incidents}) => {
 
  const { reportForm, setReportForm } = useContext(UserContext);
  const { property, agent, dateOfReport, timeOfReport, caseType, level, company, numerCase} = reportForm;


  const levels = [
   "1", "2", "3", "4"
  ];

  const team = [
     "Innova Monitoring"
    // "Impro",
  ];
  const [t] = useTranslation("global");
  return (
    <div>
      <div className="flex">
        <div className="p-inputgroup my-3">
          <span className="p-inputgroup-addon">
            <i className="pi pi-calendar"></i>
          </span>
          <Dropdown
            value={property}
            onChange={(e) =>
              setReportForm((i) => {
         
                return { ...reportForm, property:e.value };
              })
            }
            options={properties}
            optionLabel="name"
            placeholder={t("dashboard.reports.new-report.property")}
            className="w-full md:w-14rem"
          />
        </div>

        <div className="p-inputgroup my-3 ml-3">
          <span className="p-inputgroup-addon">
            <i className="pi pi-user"></i>
          </span>
          <Dropdown
            value={agent}
            onChange={(e) => setReportForm((i) => {
         
              return { ...reportForm, agent:e.value };
            })}
            options={agents}
            optionLabel="name"
            placeholder={t("dashboard.reports.new-report.agent")}
            className="w-full md:w-14rem"
          />
        </div>
      </div>

      <div className="flex">
        <div className="p-inputgroup my-3">
          <span className="p-inputgroup-addon">
            <i className="pi pi-clock"></i>
          </span>
          <Calendar
            placeholder={t("dashboard.reports.new-report.date")}
            value={dateOfReport}
            onChange={(e) => setReportForm((i) => {
             
              return { ...reportForm, dateOfReport:e.value };
            })}
          />
        </div>

        <div className="p-inputgroup my-3 ml-3">
          <span className="p-inputgroup-addon">
            <i className="pi pi-user"></i>
          </span>
          <Calendar
            placeholder={t("dashboard.reports.new-report.time")}
            value={timeOfReport}
            onChange={(e) => setReportForm((i) => {
           
              return { ...reportForm, timeOfReport:e.value };
            })}
            timeOnly
          />
        </div>
      </div>

      <div className="flex">
        <div className="p-inputgroup my-3">
          <span className="p-inputgroup-addon">
            <i className="pi pi-user"></i>
          </span>
          <Dropdown
            value={caseType}
            onChange={(e) => setReportForm((i) => {
           
              return { ...reportForm, caseType:e.value };
            })}
            options={incidents}
            optionLabel="incident"
            placeholder={t("dashboard.reports.new-report.incident")}
            className="w-full md:w-14rem"
          />
        </div>
        <div className="p-inputgroup my-3 ml-3">
          <span className="p-inputgroup-addon">
            <i className="pi pi-user"></i>
          </span>
          <Dropdown
            value={level}
            onChange={(e) => setReportForm((i) => {
              return { ...reportForm, level:e.value };
            })}
            options={levels}
            placeholder={t("dashboard.reports.new-report.level")}
            className="w-full md:w-14rem"
          />
        </div>
      </div>

      <div className="flex">
        <div className="p-inputgroup my-3 ">
          <span className="p-inputgroup-addon">
            <i className="pi pi-user"></i>
          </span>
          <Dropdown
            value={company}
            onChange={(e) => setReportForm((i) => {
        
              return { ...reportForm, company:e.value };
            })}
            options={team}
            placeholder={t("dashboard.reports.new-report.monitoring-team")}
            className="w-full md:w-14rem"
          />
        </div>
        <div className="p-inputgroup my-3 ml-3">
          <span className="p-inputgroup-addon">
            <i className="pi pi-hashtag"></i>
          </span>
          <InputText value={numerCase} onChange={(e) => setReportForm((i) => {
              return { ...reportForm, numerCase:e.target.value };
          })} placeholder={t("dashboard.reports.new-report.number-case")} />
        </div>
      </div>
    </div>
  );
};
