import React, { useContext, useEffect, useState, useMemo } from "react";
import { Header } from "../components";
import { UserContext } from "../../context/UserContext";
import "primeicons/primeicons.css";
import { useNavigate } from "react-router-dom";
import { getPropertiesInfo } from "../helper/getProperties";
// import { getIncidents } from "../helper/getIncidents";
import { getSelectableIncidents } from "../helper/Incidents/getSelectableIncidents";
import { useTranslation } from "react-i18next";
import { Button } from "primereact/button";
import Swal from 'sweetalert2'
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar } from "primereact/calendar";
import { RadioButton } from 'primereact/radiobutton';
import exportPDF from "../helper/exportPdf"
import { getAdminsAndMonitors } from "../helper/getUserAdminsaAndMonitors";
import { editReport } from "../helper/Reports/UpdateReport/editReport";
import { putAddEvidences } from "../helper/Reports/UpdateReport/putAddEvidences";
import deleteEvidence from "../helper/Reports/delete/deleteEvidence"; 
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import TypewriterTextNewReport from "../components/Texts/TypewriterTextNewReport";
import "../pages/css/Reports/EditReport.css"



const EditReport = () => {
    const { propertyContext, reportSaved, setreportSaved } = useContext(UserContext);
    const [t, i18n] = useTranslation("global");
    const navigate = useNavigate();

    const { reportForm, setReportForm } = useContext(UserContext);
    const { property, agent, createdBy, dateOfReport, timeOfReport, incidentDate, incidentStartTime, incidentEndTime, persist, caseType, level, company, numerCase, camerasFunctioning, listMalfunctioningCameras, observedViaCameras, policeFirstResponderNotified, policeFirstResponderScene, securityGuardsNotified, securityGuardsScene, policeNumerCase, reportDetails, formNotificationClient, emailedReport, pdf, evidences } = reportForm;
    console.log("EditReport data:", reportForm);

    const [properties, setProperties] = useState([]);
    const [ Users, setUsers ] = useState ([]);
    const [incidents, setIncidents] = useState([]);
    const [isOtherSeeReportActive, setIsOtherSeeReportActive] = useState(false);
    const levels = ["1", "2", "3", "4"];
    const team = ["Innova Monitoring", "Impro",];
    let user = JSON.parse(localStorage.getItem("user"));
    let userRole = user.role.rolName;

    

    
    useEffect(() => {
        const fetchProperties = async () => {
            const propertiesData = await getPropertiesInfo(navigate);
            setProperties(propertiesData);
        };

        fetchProperties();
    }, [navigate]);

    

    const fileAlreadyExists = (newFile, existingFiles, serverFiles = []) => {
        const fileNames = new Set();
        serverFiles.forEach(file => fileNames.add(file.name));
        existingFiles.forEach(file => fileNames.add(file.name));
        return fileNames.has(newFile.name);
    };

    useEffect(() => {
        if (reportForm.evidences && reportForm.evidences.length > 0 && !reportForm.evidences.some(e => e.url)) {
            const processedEvidences = reportForm.evidences.map(evidence => ({
                ...evidence,
                url: evidence.url || `${process.env.REACT_APP_S3_BUCKET_URL}/${evidence.path}`
            }));
            if (JSON.stringify(processedEvidences) !== JSON.stringify(reportForm.evidences)) {
                setReportForm(prev => ({
                    ...prev,
                    evidences: processedEvidences
                }));
            }
        }
    }, [reportForm.evidences]);

    
    const handleFileChange = (event) => {
        const files = event.target.files;
        processFiles(files);
    };

    const handleFileDrop = (event) => {
        event.preventDefault();
        const files = event.dataTransfer.files;
        processFiles(files);
    };

    const processFiles = (files) => {
        const serverEvidences = reportForm.evidences.filter(e => e.url && e.url.startsWith(process.env.REACT_APP_S3_BUCKET_URL));
        const localEvidences = reportForm.evidences.filter(e => !e.url || !e.url.startsWith(process.env.REACT_APP_S3_BUCKET_URL));

        const fileObjects = Array.from(files).reduce((acc, file) => {
            if (!fileAlreadyExists(file, localEvidences, serverEvidences)) {
                acc.push({
                    id: Date.now() + file.name,
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    file: file,
                    url: URL.createObjectURL(file)
                });
            }
            return acc;
        }, []);

        if (fileObjects.length > 0) {
            setReportForm(prev => ({
                ...prev,
                evidences: [...prev.evidences, ...fileObjects]
            }));
        }
    };  

    const updateEvidences = async () => {
        const localEvidences = reportForm.evidences.filter(e => !e.url || !e.url.startsWith(process.env.REACT_APP_S3_BUCKET_URL));
        await putAddEvidences(reportForm.id, localEvidences, t);
    };

    const handleFileRemove = async (evidence) => {
        await deleteEvidence(evidence, reportForm.id, setReportForm, t);
    };

    useEffect(() => {
        const fetchUsers = async () => {
            let usersData = await getAdminsAndMonitors();
            console.log("Users Data:", usersData); 


            const formattedUsers = usersData.map(user => ({
                label: user.name,
                value: user
            }));

            setUsers(formattedUsers);
        };

        fetchUsers();
    }, [userRole, user.id, setReportForm]);


    useEffect(() => {
        const fetchIncidents = async () => {
            const incidentsData = await getSelectableIncidents(navigate);
            setIncidents(incidentsData);
            if (reportForm.caseType?.id === 10 && reportForm.otherSeeReport) {
                setIsOtherSeeReportActive(true);
            }
        };
        fetchIncidents();
    }, [navigate]); 


    const handleCheckboxChange = (event) => {
        const checked = event.target.checked;
        setIsOtherSeeReportActive(checked);
        setReportForm(prev => ({
            ...prev,
            caseType: checked ? { id: 10, incident: "Other See Report", translate: "Otro tipo de reporte" } : {},
            otherSeeReport: checked ? prev.otherSeeReport : ''
        }));
    };

    const handleTextAreaChange = (event) => {
        setReportForm(prev => ({
            ...prev,
            otherSeeReport: event.target.value
        }));
    };


    const validateForm = () => {

        const fieldsToValidate = {
            'property.name': t("dashboard.reports.new-report.select-property"),
            'createdBy.name': t("dashboard.reports.new-report.select-user"),
            'numerCase': t("dashboard.reports.new-report.select-number-case"),
            'dateOfReport': t("dashboard.reports.new-report.select-date-of-report"),
            'timeOfReport': t("dashboard.reports.new-report.select-time-of-report"),
            'incidentDate': t("dashboard.reports.new-report.select-date-of-incident"),
            'incidentStartTime': t("dashboard.reports.new-report.select-incident-start-time"),
            'caseType.incident': t("dashboard.reports.new-report.select-incident"),
            'level': t("dashboard.reports.new-report.select-report-level"),
            'company': t("dashboard.reports.new-report.select-company"),
            'listMalfunctioningCameras': t("dashboard.reports.new-report.listMalfunctioningCameras"),
            'policeFirstResponderNotified': t("dashboard.reports.new-report.is-policeFirstResponderNotified"),
            'policeFirstResponderScene': t("dashboard.reports.new-report.police-first-responder-scene"),
            'securityGuardsNotified': t("dashboard.reports.new-report.securityGuardsNotified"),
            'securityGuardsScene': t("dashboard.reports.new-report.securityGuardsScene"),
            'formNotificationClient': t("dashboard.reports.new-report.NotificationClient"),
            'emailedReport': t("dashboard.reports.new-report.emaildReport"),
            'reportDetails': t("dashboard.reports.new-report.report-details")
        };
        
        if (!reportForm.persist) {
            fieldsToValidate.incidentEndTime = t("dashboard.reports.new-report.select-incident-end-time");
        }

        if (reportForm.checkBoxPoliceNumerCase && !reportForm.policeNumerCase) {
            Swal.fire({
                title: t("dashboard.reports.new-report.swal.fill-missing-field-title"),
                text: t("dashboard.reports.new-report.swal.fill-missing-field") + t("dashboard.reports.new-report.policeNumerCase"),
                icon: "warning",
                confirmButtonText: "Ok",
                customClass: {
                    confirmButton: "custom-swal2-confirm",
                },
                buttonsStyling: false,
            });
            return false;
        }

        const missingFieldKey = Object.keys(fieldsToValidate).find(field => {
            const fieldParts = field.split('.');
            let value = reportForm;
            for (const part of fieldParts) {
                value = value[part];
                if (value === undefined) return true;
            }
            return value === "" || value === null || (Array.isArray(value) && value.length === 0); 
        });

        if (missingFieldKey) {
            const missingFieldName = fieldsToValidate[missingFieldKey];
            Swal.fire({
                title: t("dashboard.reports.new-report.swal.fill-missing-field-title"),
                text: `${t("dashboard.reports.new-report.swal.fill-missing-field")} ${missingFieldName}`,
                icon: 'warning',
                confirmButtonText: "Ok",
                customClass: {
                    confirmButton: 'custom-swal2-confirm'
                },
                buttonsStyling: false
            });
            return false;
        }

        return true;
    };




    const malFunctionCameras = useMemo(() => [
        { label: t("dashboard.reports.edit-report.list-Malfuncion-cameras.na"), value: 'N/A' },
        { label: t("dashboard.reports.edit-report.list-Malfuncion-cameras.listedOnReport"), value: 'Listed on Report' }
    ], [t]);

    const [listpoliceFirstResponderScene, setlistpoliceFirstResponderScene] = useState([]);
    useEffect(() => {
        setlistpoliceFirstResponderScene([
            { label: t("dashboard.reports.edit-report.List-policeFirstResponderNotified.yes"), value: 'Yes' },
            { label: t("dashboard.reports.edit-report.List-policeFirstResponderNotified.no"), value: 'No' },
            { label: t("dashboard.reports.edit-report.List-policeFirstResponderNotified.n/a"), value: 'N/A' },
            { label: t("dashboard.reports.edit-report.List-policeFirstResponderNotified.fiat-security"), value: 'Fiat Security' },
            { label: t("dashboard.reports.edit-report.List-policeFirstResponderNotified.security"), value: 'Security' },
            { label: t("dashboard.reports.edit-report.List-policeFirstResponderNotified.police"), value: 'Police' },
            { label: t("dashboard.reports.edit-report.List-policeFirstResponderNotified.firemen"), value: 'Firemen' },
            { label: t("dashboard.reports.edit-report.List-policeFirstResponderNotified.ambulance"), value: 'Ambulance' },
        ]);
    }, [t, i18n.language]);



    const [listNotificationClient, setlistNotificationClient] = useState([]);
    useEffect(() => {
        setlistNotificationClient([
            { label: t("dashboard.reports.edit-report.NotificationClient-list.email"), value: 'Email' },
            { label: t("dashboard.reports.edit-report.NotificationClient-list.call-mgr"), value: 'Call MGR' },
            { label: t("dashboard.reports.edit-report.NotificationClient-list.call-asst-mgr"), value: 'CALL ASST.MGR' },
            { label: t("dashboard.reports.edit-report.NotificationClient-list.text"), value: 'Text' },
            { label: t("dashboard.reports.edit-report.NotificationClient-list.email-call"), value: 'EMAIL & CALL' },
            { label: t("dashboard.reports.edit-report.NotificationClient-list.text-call"), value: 'TEXT & CALL' },
            { label: t("dashboard.reports.edit-report.NotificationClient-list.other"), value: 'OTHER' }
        ])
    }, [t, i18n.language]);

    const [listemailedReport, setemailedReport] = useState([]);
    useEffect(() => {
        setemailedReport([
            { label: t("dashboard.reports.edit-report.emaildReport-list.property-manager"), value: 'PROPERTY MANAGER' },
            { label: t("dashboard.reports.edit-report.emaildReport-list.assitant-manager"), value: 'ASSISTANT MANAGER' },
            { label: t("dashboard.reports.edit-report.emaildReport-list.ownership"), value: 'OWNERSHIP' },
            { label: t("dashboard.reports.edit-report.emaildReport-list.corporate"), value: 'CORPORATE' },
            { label: t("dashboard.reports.edit-report.emaildReport-list.security-guard"), value: 'SECURITY GUARD' },
            { label: t("dashboard.reports.edit-report.emaildReport-list.staff"), value: 'STAFF' }
        ])
    }, [t, i18n.language])


    useEffect(() => {
        if (incidents.length > 0 && reportForm.caseType && reportForm.caseType.id) {

            const matchingCaseType = incidents.find(c => c.id === reportForm.caseType.id);
            if (matchingCaseType) {
                setReportForm(prevReportForm => ({
                    ...prevReportForm,
                    caseType: matchingCaseType,
                }));
            }
        }
    }, [incidents, reportForm.caseType]);



    const [headerTitle, setHeaderTitle] = useState("");



    useEffect(() => {
        const updateTitle = () => {
            if (reportForm.property && reportForm.property.name) {
                const newTitleWithProperty = `${t(
                    "dashboard.reports.edit-report.edit-report-with-property"
                )} ${reportForm.property.name}`;
                setHeaderTitle(newTitleWithProperty);
            } else {
                const newTitle = t("dashboard.reports.edit-report.edit-tittle");
                setHeaderTitle(newTitle);
            }
        };
        updateTitle();
        i18n.on("languageChanged", updateTitle);
        return () => i18n.off("languageChanged", updateTitle);
    }, [i18n, t, reportForm.property]);


    const editReportForm = () => {
        if (!validateForm()) return;

        Swal.fire({
            title: t("dashboard.reports.edit-report.swal.confirmation") + (reportForm.property?.name || ''),
            icon: "info",
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: '<i class="pi pi-check"></i> ' + t("dashboard.reports.edit-report.swal.send"),
            denyButtonText: `<i class="pi pi-times"></i> ` + t("dashboard.reports.edit-report.swal.don't-save"),
            buttonsStyling: false,
            customClass: {
                confirmButton: 'swal2-confirm-button-success',
                denyButton: 'swal2-deny-button',
            }
        }).then((result) => {
            if (result.isConfirmed) {
                editReport(reportForm, isOtherSeeReportActive, t);
            } else if (result.isDenied) {
                Swal.fire({
                    icon: "error",
                    title: t("dashboard.reports.edit-report.swal.canceled-report"),
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true
                });
            }
        });
    };


    return (
        <div className="m-20 md:m-10 mt-14 p-2 md:p-0 bg-white rounded-3xl">
                <h1>
                <TypewriterTextNewReport text={headerTitle} className="pt-2 pb-2" />
                </h1>
            <div className="flex flex-wrap -mx-3">

                <div className="w-full md:w-1/3 px-3 mb-6">
                    <label htmlFor="propertyType" className="font-bold block mb-2">
                        {t("dashboard.reports.edit-report.select-property")}
                    </label>
                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-home"></i>
                        </span>
                        <Dropdown
                            value={properties.find(p => p.id === property.id)} 
                            onChange={(e) => {
                                setReportForm(prevForm => ({
                                    ...prevForm,
                                    property: e.value 
                                }));
                            }}
                            options={properties}
                            optionLabel="name"
                            placeholder={t("dashboard.reports.edit-report.property")}
                            className="w-full"
                        />
                    </div>
                
                </div>

                <div className="w-full md:w-1/3 px-3 mb-6">
                    <label htmlFor="userType" className="font-bold block mb-2">
                        {t("dashboard.reports.new-report.select-user")}
                    </label>
                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-user"></i>
                        </span>
                        <Dropdown
                            value={reportForm.createdBy}
                            options={Users}
                            onChange={(e) => setReportForm(prev => ({
                                ...prev,
                                createdBy: e.value 
                            }))}
                            optionLabel="label"
                            placeholder={t("dashboard.reports.new-report.user")}
                            className="w-full"
                        />
                    </div>
                </div>



                <div className="w-full md:w-1/3 px-3 mb-6">
                    <label htmlFor="level" className="font-bold block mb-2">
                        {t("dashboard.reports.edit-report.select-number-case")}
                    </label>
                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-hashtag"></i>
                        </span>
                        <InputNumber value={numerCase} onValueChange={(e) => setReportForm((i) => {
                            return { ...reportForm, numerCase: e.value };
                        })} placeholder={t("dashboard.reports.edit-report.number-case")}
                            mode="decimal" minFractionDigits={0} />

                    </div>
                </div>

                <div className="w-full md:w-1/3 px-3 mb-6">
                    <label htmlFor="dateOfReport" className="font-bold block mb-2">
                        {t("dashboard.reports.edit-report.select-date-of-report")}
                    </label>
                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-calendar-times"></i>
                        </span>
                        <Calendar
                            placeholder={t("dashboard.reports.edit-report.date-of-report-placeholder")}
                            value={dateOfReport}
                            onChange={(e) => setReportForm((i) => {

                                return { ...reportForm, dateOfReport: e.value };
                            })}
                        />
                    </div>
                </div>

                <div className="w-full md:w-1/3 px-3 mb-6">
                    <label htmlFor="timeOfReport" className="font-bold block mb-2">
                        {t("dashboard.reports.edit-report.select-time-of-report")}
                    </label>
                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-clock"></i>
                        </span>
                        <Calendar
                            placeholder={t("dashboard.reports.edit-report.time-of-report-placeholder")}
                            value={timeOfReport}
                            onChange={(e) => setReportForm((i) => {

                                return { ...reportForm, timeOfReport: e.value };
                            })}
                            timeOnly
                        />
                    </div>
                </div>

                <div className="w-full md:w-1/3 px-3 mb-6">
                    <label htmlFor="incidentDate" className="font-bold block mb-2">
                        {t("dashboard.reports.edit-report.select-date-of-incident")}
                    </label>
                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-calendar-times"></i>
                        </span>
                        <Calendar
                            placeholder={t("dashboard.reports.edit-report.date-of-incident-placeholder")}
                            value={incidentDate}
                            onChange={(e) => setReportForm((i) => {

                                return { ...reportForm, incidentDate: e.value };
                            })}
                        />
                    </div>
                </div>

                <div className="w-full md:w-1/3 px-3 mb-6">
                    <label htmlFor="incidentStartTime" className="font-bold block mb-2">
                        {t("dashboard.reports.edit-report.select-incident-start-time")}
                    </label>
                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-clock"></i>
                        </span>
                        <Calendar
                            placeholder={t("dashboard.reports.edit-report.incident-start-time-placeholder")}
                            value={incidentStartTime}
                            onChange={(e) => setReportForm((i) => {

                                return { ...reportForm, incidentStartTime: e.value };
                            })}
                            timeOnly
                        />
                    </div>
                </div>

                <div className="w-full md:w-1/3 px-3 mb-6">
                    <div className="flex flex-col md:flex-row items-center justify-between mb-2">
                        <div className="flex-grow">
                            <label htmlFor="incidentEndTime" className="font-bold">
                                {t("dashboard.reports.edit-report.select-incident-end-time")}
                            </label>
                            <div className="checkbox-wrapper">
                                <label className="flex items-center"> {/* Añadir flex y items-center para alinear horizontalmente */}
                                    <input
                                        type="checkbox"
                                        checked={reportForm.persist}
                                        onChange={(e) => {
                                            setReportForm(prev => ({
                                                ...prev,
                                                persist: e.target.checked,
                                                incidentEndTime: e.target.checked ? null : prev.incidentEndTime
                                            }));
                                        }}
                                    />
                                    <span className="checkbox"></span>
                                    <span>{t("dashboard.reports.edit-report.persist")}</span> {/* Añadir texto aquí */}
                                </label>
                            </div>
                        </div>
                        <div className="flex-grow pt-8">
                            <Calendar
                                id="incidentEndTime"
                                placeholder={reportForm.persist ? t("dashboard.reports.edit-report.persist-placeholder") : t(
                                    "dashboard.reports.edit-report.incident-end-time-placeholder"
                                )}
                                value={reportForm.incidentEndTime}
                                onChange={(e) =>
                                    setReportForm((prev) => {
                                        return { ...prev, incidentEndTime: e.value };
                                    })
                                }
                                timeOnly
                                disabled={reportForm.persist}
                                className="w-full"
                            />
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-1/3 px-3 mb-6">
                    <div className="flex flex-col md:flex-row items-center justify-between mb-2">
                        <div className="flex-grow">
                            <label htmlFor="caseType" className="font-bold">
                                {t("dashboard.reports.edit-report.select-incident")}
                            </label>
                            <div className="flex items-center">
                                <div className="checkbox-wrapper">
                                    <label className="flex items-center"> {/* Añadir flex y items-center para alinear horizontalmente */}
                                        <input
                                            type="checkbox"
                                            checked={isOtherSeeReportActive}
                                            onChange={handleCheckboxChange}
                                            className="mr-[-8px]"
                                        />
                                        <span className="checkbox"></span>
                                        <span>{t("dashboard.reports.edit-report.other-see-report")}</span>
                                    </label>
                                </div>
                                {!isOtherSeeReportActive ? (
                                    <Dropdown
                                        value={reportForm.caseType}
                                        options={incidents}
                                        onChange={(e) => setReportForm(prev => ({ ...prev, caseType: e.value }))}
                                        optionLabel={(incident) => i18n.language === 'en' ? incident.incident : incident.translate}
                                        placeholder={t("dashboard.reports.edit-report.incident")}
                                        className="flex-grow"
                                    />
                                ) : (
                                    <InputTextarea
                                        value={reportForm.otherSeeReport}
                                        onChange={handleTextAreaChange}
                                        rows={5}
                                        autoResize
                                        placeholder={t("dashboard.reports.edit-report.other-see-report")}
                                        className="flex-grow"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-1/3 px-3 mb-6">
                    <label htmlFor="level" className="font-bold block mb-2">
                        {t("dashboard.reports.edit-report.select-report-level")}
                    </label>
                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-chart-bar"></i>
                        </span>
                        <Dropdown
                            value={level}
                            onChange={(e) => setReportForm((i) => {
                                return { ...reportForm, level: e.value };
                            })}
                            options={levels}
                            placeholder={t("dashboard.reports.edit-report.level")}
                            className="w-full md:w-14rem"
                        />
                    </div>
                </div>

                <div className="w-full md:w-1/3 px-3 mb-6">
                    <label htmlFor="company" className="font-bold block mb-2">
                        {t("dashboard.reports.edit-report.select-company")}
                    </label>
                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-list"></i>
                        </span>
                        <Dropdown
                            value={company}
                            onChange={(e) => setReportForm((i) => {

                                return { ...reportForm, company: e.value };
                            })}
                            options={team}
                            placeholder={t("dashboard.reports.edit-report.monitoring-team")}
                            className="w-full md:w-14rem"
                        />
                    </div>
                </div>

                <div className="w-full md:w-1/3 px-3 mb-6 text-center">
                    <label htmlFor="camerasfunctioning" className="font-bold block mb-2">
                        {t("dashboard.reports.edit-report.select-is-cameras-funcioning")}
                    </label>
                    <div className="flex justify-center">
                        <div className="flex align-items-center mr-2">
                            <RadioButton
                                inputId="camerasYes"
                                name="camerasFunctioning"
                                value={true}
                                onChange={(e) => {
                                    console.log('Seleccionado:', e.value);
                                    setReportForm(prevForm => ({
                                        ...prevForm,
                                        camerasFunctioning: e.value
                                    }));
                                }}
                                checked={reportForm.camerasFunctioning === true}
                            />
                            <label htmlFor="camerasYes" className="ml-2">{t("dashboard.reports.edit-report.yes")}</label>
                        </div>
                        <div className="flex align-items-center ml-4">
                            <RadioButton
                                inputId="camerasNo"
                                name="camerasFunctioning"
                                value={false}
                                onChange={(e) => {
                                    console.log('Seleccionado:', e.value);
                                    setReportForm(prevForm => ({
                                        ...prevForm,
                                        camerasFunctioning: e.value
                                    }));
                                }}
                                checked={reportForm.camerasFunctioning === false}
                            />
                            <label htmlFor="camerasNo" className="ml-2">{t("dashboard.reports.edit-report.no")}</label>
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-1/3 px-3 mb-6">
                    <label htmlFor="MalfuncioningCameras" className="font-bold block mb-2">
                        {t("dashboard.reports.edit-report.listMalfunctioningCameras")}
                    </label>
                    <div className="p-inputgroup">
                        <img></img>
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-camera"></i>
                        </span>
                        <Dropdown
                            value={listMalfunctioningCameras}
                            onChange={(e) => setReportForm((prev) => ({
                                ...prev,
                                listMalfunctioningCameras: e.value
                            }))}
                            options={malFunctionCameras}
                            optionLabel="label"
                            placeholder={t("dashboard.reports.edit-report.selectMalfunctioningCamerasPlaceholder")}
                            className="w-full md:w-14rem"
                        />
                    </div>
                </div>

                <div className="w-full md:w-1/3 px-3 mb-6 text-center">
                    <label htmlFor="observedViaCameras" className="font-bold block mb-2">
                        {t("dashboard.reports.edit-report.select-observedViaCameras")}
                    </label>
                    <div className="flex justify-center">
                        <div className="flex align-items-center mr-2">
                            <RadioButton
                                inputId="camerasYes"
                                name="observedViaCameras"
                                value={true}
                                onChange={(e) => {
                                    console.log('Seleccionado:', e.value);
                                    setReportForm(prevForm => ({
                                        ...prevForm,
                                        observedViaCameras: e.value
                                    }));
                                }}
                                checked={reportForm.observedViaCameras === true}
                            />
                            <label htmlFor="camerasYes" className="ml-2">{t("dashboard.reports.edit-report.yes")}</label>
                        </div>
                        <div className="flex align-items-center ml-4">
                            <RadioButton
                                inputId="camerasNo"
                                name="observedViaCameras"
                                value={false}
                                onChange={(e) => {
                                    console.log('Seleccionado:', e.value);
                                    setReportForm(prevForm => ({
                                        ...prevForm,
                                        observedViaCameras: e.value
                                    }));
                                }}
                                checked={reportForm.observedViaCameras === false}
                            />
                            <label htmlFor="camerasNo" className="ml-2">{t("dashboard.reports.edit-report.no")}</label>
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-1/3 px-3 mb-6 text-center">
                    <label htmlFor="policeFirstResponderNotified" className="font-bold block mb-2">
                        {t("dashboard.reports.edit-report.is-policeFirstResponderNotified")}
                    </label>
                    <div className="flex justify-center">
                        <div className="flex align-items-center mr-2">
                            <RadioButton
                                inputId="camerasYes"
                                name="policeFirstResponderNotified"
                                value={true}
                                onChange={(e) => {
                                    console.log('Seleccionado:', e.value);
                                    setReportForm(prevForm => ({
                                        ...prevForm,
                                        policeFirstResponderNotified: e.value
                                    }));
                                }}
                                checked={reportForm.policeFirstResponderNotified === true}
                            />
                            <label htmlFor="camerasYes" className="ml-2">{t("dashboard.reports.edit-report.yes")}</label>
                        </div>
                        <div className="flex align-items-center ml-4">
                            <RadioButton
                                inputId="camerasNo"
                                name="policeFirstResponderNotified"
                                value={false}
                                onChange={(e) => {
                                    console.log('Seleccionado:', e.value);
                                    setReportForm(prevForm => ({
                                        ...prevForm,
                                        policeFirstResponderNotified: e.value
                                    }));
                                }}
                                checked={reportForm.policeFirstResponderNotified === false}
                            />
                            <label htmlFor="camerasNo" className="ml-2">{t("dashboard.reports.edit-report.no")}</label>
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-1/3 px-3 mb-6">
                    <label htmlFor="policeFirstResponderNotified" className="font-bold block mb-2">
                        {t("dashboard.reports.edit-report.police-first-responder-scene")}
                    </label>
                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-list"></i>
                        </span>
                        <Dropdown
                            value={policeFirstResponderScene}
                            onChange={(e) => setReportForm((prev) => ({
                                ...prev,
                                policeFirstResponderScene: e.value
                            }))}
                            options={listpoliceFirstResponderScene}
                            optionLabel="label"
                            placeholder={t("dashboard.reports.edit-report.policeFirstResponderSceneeholder")}
                            className="w-full md:w-14rem"
                        />
                    </div>
                </div>

                <div className="w-full md:w-1/3 px-3 mb-6 text-center">
                    <label htmlFor="GuardsNotified" className="font-bold block mb-2">
                        {t("dashboard.reports.edit-report.securityGuardsNotified")}
                    </label>
                    <div className="flex justify-center">
                        <div className="flex align-items-center mr-2">
                            <RadioButton
                                inputId="securityGuardsNotifiedYes"
                                name="securityGuardsNotified"
                                value={true}
                                onChange={(e) => {
                                    console.log('Seleccionado:', e.value);
                                    setReportForm(prevForm => ({
                                        ...prevForm,
                                        securityGuardsNotified: e.value
                                    }));
                                }}
                                checked={reportForm.securityGuardsNotified === true}
                            />
                            <label htmlFor="securityGuardsNotifiedYes" className="ml-2">{t("dashboard.reports.edit-report.yes")}</label>
                        </div>
                        <div className="flex align-items-center ml-4">
                            <RadioButton
                                inputId="securityGuardsNotifiedNo"
                                name="securityGuardsNotified"
                                value={false}
                                onChange={(e) => {
                                    console.log('Seleccionado:', e.value);
                                    setReportForm(prevForm => ({
                                        ...prevForm,
                                        securityGuardsNotified: e.value
                                    }));
                                }}
                                checked={reportForm.securityGuardsNotified === false}
                            />
                            <label htmlFor="securityGuardsNotifiedNo" className="ml-2">{t("dashboard.reports.edit-report.no")}</label>
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-1/3 px-3 mb-6 text-center">
                    <label htmlFor="GuardsScene" className="font-bold block mb-2">
                        {t("dashboard.reports.edit-report.securityGuardsScene")}
                    </label>
                    <div className="flex justify-center">
                        <div className="flex align-items-center mr-2">
                            <RadioButton
                                inputId="securityGuardsSceneYes"
                                name="securityGuardsScene"
                                value={true}
                                onChange={(e) => {
                                    console.log('Seleccionado:', e.value);
                                    setReportForm(prevForm => ({
                                        ...prevForm,
                                        securityGuardsScene: e.value
                                    }));
                                }}
                                checked={reportForm.securityGuardsScene === true}
                            />
                            <label htmlFor="securityGuardsSceneYes" className="ml-2">{t("dashboard.reports.edit-report.yes")}</label>
                        </div>
                        <div className="flex align-items-center ml-4">
                            <RadioButton
                                inputId="securityGuardsSceneNo"
                                name="securityGuardsScene"
                                value={false}
                                onChange={(e) => {
                                    console.log('Seleccionado:', e.value);
                                    setReportForm(prevForm => ({
                                        ...prevForm,
                                        securityGuardsScene: e.value
                                    }));
                                }}
                                checked={reportForm.securityGuardsScene === false}
                            />
                            <label htmlFor="securityGuardsSceneNo" className="ml-2">{t("dashboard.reports.edit-report.no")}</label>
                        </div>
                    </div>
                </div>

                {/* <div className="w-full md:w-1/3 px-3 mb-6">
                    <label htmlFor="policeNumerCase" className="font-bold block mb-2">
                        {t("dashboard.reports.edit-report.policeNumerCase")}
                    </label>
                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-hashtag"></i>
                        </span>
                        <InputNumber value={policeNumerCase} onValueChange={(e) => setReportForm((i) => {
                            return { ...reportForm, policeNumerCase: e.value };
                        })} placeholder={t("dashboard.reports.edit-report.policeNumerCase-placeholder")}
                            mode="decimal" minFractionDigits={0} />
                    </div>
                </div> */}

                <div className="w-full md:w-1/3 px-3 mb-6">
                    <div className="flex flex-col md:flex-row items-center justify-between mb-2">
                        <div className="flex-grow">
                            <label htmlFor="policeNumerCase" className="font-bold">
                                {t("dashboard.reports.edit-report.policeNumerCase")}
                            </label>
                            <div className="checkbox-wrapper">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={reportForm.checkBoxPoliceNumerCase}
                                        onChange={(e) => {
                                            setReportForm(prev => ({
                                                ...prev,
                                                checkBoxPoliceNumerCase: e.target.checked,
                                                policeNumerCase: e.target.checked ? prev.policeNumerCase : ""
                                            }));
                                        }}
                                    />
                                    <span className="checkbox"></span>
                                    <span>{t("dashboard.reports.new-report.include-police-number-case")}</span>
                                </label>
                            </div>
                        </div>
                        <div className="flex-grow pt-8">
                            <InputNumber
                                value={reportForm.policeNumerCase}
                                onValueChange={(e) =>
                                    setReportForm((prev) => {
                                        return { ...prev, policeNumerCase: e.value };
                                    })
                                }
                                placeholder={t("dashboard.reports.new-report.policeNumerCase-placeholder")}
                                mode="decimal"
                                minFractionDigits={0}
                                disabled={!reportForm.checkBoxPoliceNumerCase}
                                className="w-full"
                            />
                        </div>
                    </div>
                </div>




                <div className="w-full md:w-1/3 px-3 mb-6">
                    <label htmlFor="NotificationClient" className="font-bold block mb-2">
                        {t("dashboard.reports.edit-report.NotificationClient")}
                    </label>
                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-list"></i>
                        </span>
                        <Dropdown
                            value={formNotificationClient}
                            onChange={(e) => setReportForm((prev) => ({
                                ...prev,
                                formNotificationClient: e.value
                            }))}
                            options={listNotificationClient}
                            optionLabel="label"
                            placeholder={t("dashboard.reports.edit-report.NotificationClient-placeholder")}
                            className="w-full md:w-14rem"
                        />
                    </div>
                </div>

                <div className="w-full md:w-1/3 px-3 mb-6">
                    <label htmlFor="emaildReport" className="font-bold block mb-2">
                        {t("dashboard.reports.edit-report.emaildReport")}
                    </label>
                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-list"></i>
                        </span>
                        <Dropdown
                            value={emailedReport}
                            onChange={(e) => setReportForm((prev) => ({
                                ...prev,
                                emailedReport: e.value
                            }))}
                            options={listemailedReport}
                            optionLabel="label"
                            placeholder={t("dashboard.reports.edit-report.emaildReport-placeholder")}
                            className="w-full md:w-14rem"
                        />
                    </div>
                </div>

                <div className="w-full px-3 mb-6">
                    <div className="file-upload bg-white p-4 rounded-lg shadow">
                        <input
                            type="file"
                            id="file-input"
                            multiple
                            onChange={handleFileChange}
                            accept="image/*,video/*"
                            style={{ display: 'none' }}
                        />
                        <div className="file-select-button mb-3">
                            <label htmlFor="file-input" className="cursor-pointer text-blue-500 flex items-center">
                                <i className="pi pi-plus" style={{ 'fontSize': '1.5em' }}></i> <span className="ml-2">{t("dashboard.reports.new-report.upload-evidences")}</span>
                            </label>
                        </div>
                        <div className="drop-area text-center p-10 bg-blue-100 border-blue-500 border-dashed rounded-lg hover:bg-blue-200"
                            onDragOver={e => e.preventDefault()}
                            onDrop={handleFileDrop}
                            onClick={() => document.getElementById('file-input').click()}
                        >
                            <i className="pi pi-upload" style={{ 'fontSize': '2em' }}></i>
                            <p>{t("dashboard.reports.new-report.drop-evidences")}</p>
                        </div>
                        <div className="files-list">
                            {reportForm.evidences.map((file) => (
                                <div key={file.id || file.name} className="file-item flex items-center justify-between mb-2 bg-gray-100 p-2 rounded">
                                    {(file.type === 'image' || (file.type && file.type.startsWith('image/'))) && (
                                        <img src={file.url} alt={file.name} className="file-image-preview w-20 h-20 mr-2" />
                                    )}
                                    <div className="file-details flex-grow">
                                        <span className="file-name font-semibold">{file.name}</span>
                                        <Button icon="pi pi-times" className="p-button-rounded p-button-danger margin-delete-button" onClick={() => handleFileRemove(file)} />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button
                            label={t("dashboard.reports.edit-report.update-evidences.button-update-evidences")}
                            icon="pi pi-refresh"
                            className="p-button update-button" 
                            onClick={updateEvidences}
                        />
                    </div>
                </div>



                <div className="w-full px-3 mb-6">
                    <label htmlFor="reportDetails" className="font-bold block mb-2">
                        {t("dashboard.reports.edit-report.report-details")}
                    </label>
                    <div className="p-inputgroup">
                        <InputTextarea
                            value={reportForm.reportDetails}
                            onChange={(e) => setReportForm((prev) => ({
                                ...prev,
                                reportDetails: e.target.value
                            }))}
                            rows={5}
                            cols={30}
                            autoResize
                            placeholder={t("dashboard.reports.edit-report.report-details-placeholder")}
                        />
                    </div>
                </div>


            </div>

            <div className="flex justify-end mt-4 pr-20">  
            <button
                className="send-button"
                onClick={editReportForm}
            >
                <div class="svg-wrapper-1">
                    <div class="svg-wrapper">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="24"
                            height="24"
                        >
                            <path fill="none" d="M0 0h24v24H0z"></path>
                            <path
                                fill="currentColor"
                                d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
                            ></path>
                        </svg>
                    </div>
                </div>
                <span>
                    {t("dashboard.reports.edit-report.swal.send")}
                </span>
            </button>
            </div>
           
        </div>

    );
};

export default EditReport;


