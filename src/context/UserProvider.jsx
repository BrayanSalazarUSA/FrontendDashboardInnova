import React, { useState } from "react";
import { UserContext } from "./UserContext";
import { faListCheck } from "@fortawesome/free-solid-svg-icons";

export const UserProvider = ({ children }) => {
  
  const [userContext, setUserContext] = useState({});
  const [propertyContext, setPropertyContext] = useState({});
  const [reportContext, setReportContext] = useState({});
  const [cameraContext, setCameraContext] = useState({});
  const [prueba, setPrueba] = useState("Prueba");
  const [reportSaved, setreportSaved] = useState(false);
  const [cameraSaved, setCameraSaved] = useState(false);
  const [propertySaved, setPropertySaved] = useState(false)
  const [edit, setEdit] = useState(false)
  const [userLogged, setUserLogged] = useState(false);
  const [reportFormVisible, setReportFormVisible] = useState(false);
  const [flag, setFlag] = useState(false)
  const [cameraFormFlag, setCameraFormFlag] = useState("")
  
  const [reportForm, setReportForm] = useState({
    id:"",
    property: {},
    createdBy: {}, 
    dateOfReport: new Date(),
    timeOfReport: new Date(),
    incidentDate: new Date(),
    incidentStartTime: new Date(),
    incidentEndTime: new Date(),
    persist: false,
    caseType: {},
    level: "",
    company: "",
    numerCase: "",
    camerasFunctioning: true,
    listMalfunctioningCameras: "",
    observedViaCameras: true,
    policeFirstResponderNotified: false,
    policeFirstResponderScene: "",
    securityGuardsNotified: false,
    securityGuardsScene: false,
    checkBoxPoliceNumerCase: false,
    policeNumerCase: "",
    formNotificationClient: "",
    emailedReport: "",
    reportDetails: "",
    pdf: "",
    evidences: [] 
    });

  const [cameraForm, setCameraForm] = useState({
    name: "",
    brand: "",
    installedByUs: "",
    dateInstalled: new Date(),
    image: "",
    status: "",
    type: "",
    lat:"",
    long:"",
    rotation:"", 
    property: {},
  });

  const [caseProvider, setCaseProvider] = useState({
    id: "",
    incident_eng: "",
    incident_es: ""
  });

  const [userProvider, setUserProvider] = useState({
    id: null,
    name: "",
    email: "",
    image: "",
    password:"",
    manager:0,
    categoryEmail:0,
    rol: {
      rolName:""
    },
    properties: [],
  });


  
  const [agentProvider, setagentProvider] = useState({
    id:null,
    name:"",
    lastName:"",
    email:"",
    image:""
  })

  const [propertyProvider, setPropertyProvider] = useState({
    id:"",
    name:"",
    direction:"",
    img:"",
    mapImg:""
  })
  const [caseDialog, setCaseDialog] = useState(false);
  const [userDialog, setUserDialog] = useState(false);
  const [agentDialog, setAgentDialog] = useState(false);
  const [editCase, setEditCase] = useState(false);
const [editReportFormVisible, setEditReportFormVisible] = useState(false)
const [creatingReport, setCreatingReport] = useState(false);
const [refreshReports, setRefreshReports] = useState(false)

  return (
    <UserContext.Provider
      value={{
        prueba,
        setPrueba,
        userContext,
        setUserContext,
        propertyContext,
        setPropertyContext,
        reportContext,
        setReportContext,
        reportForm,
        setReportForm,
        cameraForm,
        setCameraForm,
        cameraContext,
        setCameraContext,
        reportSaved,
        setreportSaved,
        cameraSaved,
        setCameraSaved,
        caseProvider,
        setCaseProvider,
        caseDialog,
        setCaseDialog,
        editCase,
        setEditCase,
        userProvider, 
        setUserProvider,
        edit, setEdit,
        userDialog, setUserDialog,
        agentProvider, setagentProvider,
        agentDialog, setAgentDialog,
        userLogged, setUserLogged,
        reportFormVisible, setReportFormVisible,
        propertyProvider, setPropertyProvider,
        propertySaved, setPropertySaved,
        flag, setFlag,
         editReportFormVisible,
    setEditReportFormVisible,
    cameraFormFlag, setCameraFormFlag,
    creatingReport, setCreatingReport,
    refreshReports, setRefreshReports
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
