import React, { useEffect, useState } from "react";
import { Stack } from "@mui/material";
import { Calendar } from "primereact/calendar";
import { Box, Chip, styled } from "@material-ui/core";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { useTranslation } from "react-i18next";
import video from "../../../assets/videos/video.mp4";
import { formatTime } from "../../helper/postReport";
import { getPropertiesInfo } from "../../helper/getProperties";
import { getAgents } from "../../helper/getAgents";
import { FaClock } from "react-icons/fa";
import { getAdminsAndMonitors } from "../../helper/getUserAdminsaAndMonitors";
import { getUsersDTO } from "../../helper/getUsersDTO";
import logo from "../../../assets/images/Logos/logo.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Confetti from "react-confetti";
import postRequest from "../../helper/postRequest";
import emailjs from "emailjs-com";
import swal from "sweetalert2";
import { InputSwitch } from "primereact/inputswitch";
import { EditAttributes, HighlightOff, Message } from "@mui/icons-material";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { updateRequestStatus } from "../../helper/updateRequestStatus";
import Badge from "@mui/material/Badge";
import MailIcon from "@mui/icons-material/Mail";
import updateRequest from "../../helper/Requests/updateRequest";
const notificationOptions = [
  {
    label: "Dashboard",
    value: "Dashboard",
    icon: "pi pi-desktop",
    color: "#d6aa25",
  },
  {
    label: "WhatsApp",
    value: "Whatsapp",
    icon: "pi pi-whatsapp",
    color: "#25D366",
  },
  { label: "Email", value: "Email", icon: "pi pi-envelope", color: "#0078D4" },
  { label: "Call", value: "Call", icon: "pi pi-phone", color: "#34B7F1" },
  { label: "Text", value: "Text", icon: "pi pi-comment", color: "#757575" },
];

const statuses = [
  { label: "Not Started", color: "gray" },
  { label: "In Process", color: "#1D7AFC" },
  { label: "Completed", color: "#22A06B" },
];

const RequestForm = ({
  selectedRequest,
  setSelectedRequest,
  handleClose,
  addNewRequest,
  setAddNewRequest,
  userRole,
  setUpdates,
}) => {
  const [properties, setProperties] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(
    selectedRequest.property
  );
const [originalChanges, setOriginalChanges] = useState([]);
  const [newRequest, setNewRequest] = useState({});
  const userSession = JSON.parse(localStorage.getItem("user"));
  const [selectedUser, setSelectedUser] = useState(selectedRequest.responsible);
  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [activeStatus, setActiveStatus] = useState(selectedRequest.state);

  const [edit, setEdit] = useState(true);
  const { t } = useTranslation("global");

  useEffect(() => {
    const fetchId = async () => {
      if (!selectedRequest.id) {
        const response = await fetch(
          process.env.REACT_APP_SERVER_IP + "/requests/nextId"
        );
        const request_id = await response.json();
        setSelectedRequest((prev) => ({ ...prev, id: request_id }));
      }
    };

    setOriginalChanges(selectedRequest?.responsabilityChange || []);

    fetchId();

    // Establecer la fecha y hora actuales por defecto si no están definidas
    const currentDate = new Date();
    if (!selectedRequest.requestDate) {
      setSelectedDate(currentDate);
      setSelectedRequest((prev) => ({
        ...prev,
        requestDate: formatDate(currentDate),
      }));
    } else {
      setSelectedDate(new Date(selectedRequest.requestDate));
    }
    if ((userRole === "Client" || userRole === "Monitor") && !addNewRequest) {
      setEdit(false);
    }

    if (!selectedRequest.requestTime) {
      setSelectedTime(currentDate);
      setSelectedRequest((prev) => ({
        ...prev,
        requestTime: formatTime(currentDate),
      }));
    } else {
      setSelectedTime(stringToTime(selectedRequest.requestTime));
    }

    if (!selectedRequest.estipulatedTime) {
      setSelectedRequest((prev) => ({ ...prev, estipulatedTime: 12 }));
    }

    if (!selectedRequest.state) {
      setSelectedRequest((prev) => ({ ...prev, state: "Not Started" }));
      setActiveStatus("Not Started");
    }

    const fetchUsers = async () => {
      const agentsResponse = await getUsersDTO(); // Suponiendo que getUsersDTO es una función que hace la petición
      setUsers(agentsResponse);
      const initialUser =
        agentsResponse.find(
          (user) => user?.id === selectedRequest?.responsible?.id
        ) || {};

      setSelectedUser(initialUser);
      const propertiesResponse = await getPropertiesInfo();
      setProperties(propertiesResponse);
      const initialProperty =
        propertiesResponse.find(
          (property) => property?.id === selectedRequest?.property?.id
        ) || {};
      setSelectedProperty(initialProperty);
    };

    //Revisar, solo debe actualizarse cuando cambia el responsable
    setSelectedUser(selectedRequest.responsible);
    fetchUsers();
    console.log("Selected Request");
    console.log(selectedRequest);
  }, [addNewRequest]);

  const postData = async () => {
    setAddNewRequest(false);

    if (!selectedRequest.requestDate) {
      const currentDate = formatDate(new Date());
      setSelectedRequest((prev) => ({ ...prev, requestDate: currentDate }));
    }

    if (!selectedRequest.requestTime) {
      const currentTime = formatTime(new Date());
      setSelectedRequest((prev) => ({ ...prev, requestTime: currentTime }));
    }

    if (Object.keys(newRequest).length > 0) {
      try {
        console.log("Se ejecutó la petición");
        const sendRequestUpdate = await postRequest(selectedRequest);
        console.log(sendRequestUpdate);

        // Mostrar notificación de éxito
        toast.success("Request Saved.", {
          position: "top-center",
          autoClose: 6000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } catch (error) {
        console.error("Error sending request:", error);

        // Mostrar notificación de error
        toast.error(`Error sending request:: ${error.message}`, {
          position: "top-center",
          autoClose: 6000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    }

    setEdit((prev) => !prev);
    setTimeout(() => {
      handleClose();
    }, 5000);
  };


  const updateData = async () => {
    setAddNewRequest(false);

    if (!selectedRequest.requestDate) {
      const currentDate = formatDate(new Date());
      setSelectedRequest((prev) => ({ ...prev, requestDate: currentDate }));
    }

    if (!selectedRequest.requestTime) {
      const currentTime = formatTime(new Date());
      setSelectedRequest((prev) => ({ ...prev, requestTime: currentTime }));
    }

    if (Object.keys(newRequest).length > 0) {
      try {
        console.log("Se ejecutó la petición");
        const sendRequestUpdate = await updateRequest(selectedRequest);
        console.log(sendRequestUpdate);

        // Mostrar notificación de éxito
        toast.success("Request Saved.", {
          position: "top-center",
          autoClose: 6000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } catch (error) {
        console.error("Error sending request:", error);

        // Mostrar notificación de error
        toast.error(`Error sending request:: ${error.message}`, {
          position: "top-center",
          autoClose: 6000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    }

    setEdit((prev) => !prev);
    setTimeout(() => {
      handleClose();
    }, 5000);
  };


  const updateStatus = async (newStatus) => {
    console.log("Se ejecutó la petición update");
    const sendRequestUpdate = await updateRequestStatus(
      selectedRequest.id,
      newStatus
    );

    setEdit((prev) => !prev);
    setTimeout(() => {
      handleClose();
    }, 5000);
  };

  const onUserChange = (e) => {
    console.log(selectedRequest.responsible)
    console.log(e.value)
    setSelectedRequest((prevStatus) => ({
      ...prevStatus,
      responsabilityChange: [
          ...originalChanges, // Mantener los cambios anteriores
          { 
              previousResponsible: selectedRequest.responsible, // El responsable anterior
              newResponsible: e.value, // El nuevo responsable seleccionado
              timestamp:"08-15-2024 12:21"
          }
      ]
  }));

    setSelectedUser(e.value);
    setSelectedRequest((prevStatus) => ({
      ...prevStatus,
      responsible: e.value,
    }));
    setNewRequest(selectedRequest);


  
  };

  const formatDate = (date) => {
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${month}-${day}-${date.getFullYear()}`;
  };

  const stringToTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(":");
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    return date;
  };

  const handleDateChange = (e) => {
    const newDate = e.value;
    setSelectedDate(newDate);
    setSelectedRequest((prevRequest) => ({
      ...prevRequest,
      requestDate: formatDate(newDate),
    }));
    setNewRequest(selectedRequest);
  };

  const handleTimeChange = (e) => {
    const newTime = e.value;
    setSelectedTime(newTime);
    setSelectedRequest((prevRequest) => ({
      ...prevRequest,
      requestTime: formatTime(newTime),
    }));
    setNewRequest(selectedRequest);
  };

  const onPropertyChange = (e) => {
    /* const selectedProp = properties.find((prop) => prop.id === e.value); */
    setSelectedProperty(e.value);
    setSelectedRequest((prevRequest) => ({
      ...prevRequest,
      property: e.value,
    }));
    setNewRequest(selectedRequest);
  };

  const onNotificationChange = (e) => {
    setSelectedRequest({ ...selectedRequest, formOfNotification: e.value });
    setNewRequest(selectedRequest);
  };

  const selectedOptionTemplate = (option) =>
    option ? (
      <div className="flex align-items-center">
        <i
          className={`${option.icon} mr-2 rounded-full p-2`}
          style={{ backgroundColor: option.color, color: "white" }}
        ></i>
        <span style={{ color: option.color }}>{option.label}</span>
      </div>
    ) : (
      <span>Notification method</span>
    );

  const optionTemplate = (option) => (
    <div className="flex align-items-center">
      <i
        className={`${option.icon} mr-2 rounded-full p-2`}
        style={{ backgroundColor: option.color, color: "white" }}
      ></i>
      <span style={{ color: option.color }}>{option.label}</span>
    </div>
  );

  const userOptionTemplate = (option) => {
    return (
      <div className="flex align-items-center">
        <img
          alt={option.name}
          src={process.env.REACT_APP_S3_BUCKET_URL + "/" + option.image}
          style={{ width: "24px", marginRight: "8px" }}
        />
        <span>{option.name}</span>
      </div>
    );
  };

  const userValueTemplate = (option) => {
    if (option) {
      return (
        <div className="flex align-items-center">
          <img
            alt={option.name}
            src={process.env.REACT_APP_S3_BUCKET_URL + "/" + option.image}
            style={{ width: "24px", marginRight: "8px" }}
          />
          <span>{option.name}</span>
        </div>
      );
    }
    return <span>Select an Agent</span>;
  };

  const CustomChip = styled(Chip)(({ selected, color }) => ({
    backgroundColor: selected ? color : "#e0e0e0",
    color: selected ? "white" : "black",
    fontWeight: selected ? "bold" : "normal",
    "&:hover": {
      backgroundColor: selected ? color : "#d5d5d5",
    },
  }));

  const sendEmailRequestUpdated = (status) => {
    function getBanner() {
      let requestBanner = "";

      switch (status) {
        case "Completed":
          requestBanner =
            "https://innova-bucket.s3.amazonaws.com/Assets/completed-request.png";
          break;
        case "In Process":
          requestBanner =
            "https://innova-bucket.s3.amazonaws.com/Assets/in-process-request.png";
          break;
        case "Expired":
          requestBanner =
            "https://innova-bucket.s3.amazonaws.com/Assets/expired-request.png";
          break;
        default:
          requestBanner =
            "https://innova-bucket.s3.amazonaws.com/Assets/in-process-request.png";
      }
      return requestBanner;
    }

    const templateParams = {
      requestBanner: getBanner(selectedRequest.state),
      property: selectedRequest.property.name,
      client: selectedRequest.client,
      requestDate: selectedRequest.requestDate,
      date: "7/26/2024",
      time: "2:52",
      responsible: selectedRequest.responsible.name,
      monitorImage:
        process.env.REACT_APP_S3_BUCKET_URL +
        "/" +
        selectedRequest.responsible.image,
      identification: selectedRequest.id,
      formOfNotification: selectedRequest.formOfNotification,
      estipulatedTime: selectedRequest.estipulatedTime,
      priority: selectedRequest.priority,
      requestTime: selectedRequest.requestTime,
      deadline: selectedRequest.deadline || "00:00",
      timeFinished: selectedRequest.timeFinished,
      details: selectedRequest.details,
      agentEmail: userSession.email,
    };

    // EmailJS user ID, service ID, and template ID
    const userID = process.env.REACT_APP_EMAILJS_SENDINGD_REPORT_USER_ID;
    const serviceID = process.env.REACT_APP_EMAILJS_SENDINGD_REPORT_SERVICE_ID;
    const templateID = "template_nyurivx";

    emailjs.send(serviceID, templateID, templateParams, userID).then(
      (response) => {
        console.log("SUCCESS!", response.status, response.text);
        console.log("lo que se envia", templateParams);
      },
      (err) => {
        console.log("FAILED...", err);
        swal.fire({
          icon: "warning",
          text: t("Error sending de email."),
          timer: 4000,
          position: "top-end",
          showConfirmButton: false,
        });
      }
    );
    console.log("templateParams");
    console.log(templateParams);
  };

  const handleStatusChange = async (status) => {
    setActiveStatus(status);
    setSelectedRequest((prevRequest) => ({
      ...prevRequest,
      state: status,
    }));

    let userName = userSession?.name?.split(" ")[0] || "";

    if (status == "Completed") {
      toast.success(
        `Congratulations ${userName}!You have completed your task.`,
        {
          position: "top-center",
          autoClose: 6000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 6000); //Stop the confetti after 5 seconds
    }
    updateStatus(status);
    setNewRequest(selectedRequest);
    if (status === "Completed" || status === "In Process") {
      sendEmailRequestUpdated(status);
    }
  };

  return (
    <Box sx={modalStyle}>
      {selectedRequest && (
        <section className="relative bg-request bg-no-repeat bg-cover bg-center p-10">
          <video
            autoPlay
            loop
            muted
            className="absolute inset-0 w-full h-full object-cover z-0"
          >
            <source src={video} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="relative container rounded-xl w-full sm:w-10/12 mx-auto lg:grid lg:grid-cols-2 gap-6 z-10 bg-dark p-5 sm:p-6">
            <ToastContainer className="mt-32" />
            {showConfetti && <Confetti className="z-50 " />}
            <div className="flex flex-col">
              <img src={logo} className="w-48 object-contain mb-4" alt="Logo" />
              <h1 className="text-2xl font-semibold text-gray-300">
                Make a request
              </h1>
              <p className="my-3 text-gray-300">
                Below please write a Detailed description of the investigation
                being requested
              </p>
              <InputTextarea
                id="details"
                disabled={!edit}
                value={selectedRequest.details}
                rows={11}
                cols={45}
                onChange={(e) => {
                  setSelectedRequest((prevStatus) => ({
                    ...prevStatus,
                    details: e.target.value,
                  }));

                  setNewRequest(selectedRequest);
                }}
                placeholder="Request Details..."
                className="w-full"
              />

              {/* PARA MANEJAR EL ESTADO DE HABILITAR Y DEHABILITAR EDICION */}
              {/* {userSession?.role.rolName === "Admin" || userSession?.role.rolName === "Supervisor" ? (
                <div>
                  <label
                    htmlFor="switch1"
                    className="block text-white input-label mt-3"
                  >
                    Edit Request <EditAttributes />
                  </label>
                  <InputSwitch
                    checked={edit}
                    onChange={(e) => setEdit((prev) => !prev)}
                    inputId="switch1"
                  />{" "}
                </div>
              ) : (
                <></>
              )} */}
              {(addNewRequest &&
               (userRole === "Supervisor" ||
                userRole === "Admin")) && (
                <button onClick={postData} className="button mt-4">
                  Send Request
                  <AiOutlinePlusCircle />
                </button>
              )
              
            /*   (!addNewRequest)&& (
                <button onClick={updateData} className="button mt-4">
                  Update Request
                  <AiOutlinePlusCircle />
                </button>
              ) */}

              {
                (!addNewRequest)&& (
                  <button onClick={updateData} className="button mt-4">
                    Update Request
                    <AiOutlinePlusCircle />
                  </button>
                ) 
              }
            </div>

            <div className="card flex justify-content-center"></div>
            <div className="flex flex-col space-y-4">
              <div className="border border-[#835c0e] rounded-lg p-3">
                <span className="identification-id flex justify-between items-center">
                  <span>Investigation ID: {selectedRequest.id}</span>
                  <Badge
                    badgeContent={4}
                    sx={{
                      "& .MuiBadge-badge": {
                        backgroundColor: "#f44336",
                        color: "white",
                        fontSize: "14px", // Aumenta el tamaño de la fuente si es necesario
                        fontWeight: "bold",
                        width: "10px", // Ajusta el ancho del badge
                        height: "10px", // Ajusta la altura del badge
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center", // Centra el contenido dentro del badge
                        zIndex: 10000000,
                      },
                    }}
                  >
                    <MailIcon
                      color="action"
                      style={{
                        color: "#006BB3",
                        backgroundColor: "gold",
                        borderRadius:"100%",
                        fontSize: "35px",
                        padding:"3px",
                        fontWeight: "600",
                        cursor: "pointer",
                        animation: "bounce 3s infinite",
                        transition: "transform 0.2s ease-in-out",
                        filter: "drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.2))",
                      }}
                      onMouseEnter={(e) =>
                        (e.target.style.transform = "scale(1.2)")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.transform = "scale(1)")
                      }
                      onClick={() => setUpdates((prev) => !prev)}
                    />
                  </Badge>

                  <HighlightOff
                    onClick={handleClose}
                    className="cursor-pointer font-bold"
                    style={{
                      color: "#FF4C4C",
                      fontSize: "30px",
                      fontWeight: "600",
                    }}
                  />
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="client"
                    className="block text-white input-label"
                  >
                    Client
                  </label>
                  <InputText
                    id="client"
                    disabled={!edit}
                    label="Client"
                    variant="outlined"
                    placeholder="Client Name"
                    required
                    margin="normal"
                    value={selectedRequest.client}
                    onChange={(e) => {
                      setSelectedRequest((prevRequest) => ({
                        ...prevRequest,
                        client: e.target.value,
                      }));
                      setNewRequest(selectedRequest);
                    }}
                    className="w-full"
                  />
                </div>
                <div>
                  <label htmlFor="property" className="block input-label">
                    Property
                  </label>
                  <Dropdown
                    id="property"
                    value={selectedProperty}
                    options={properties}
                    onChange={onPropertyChange}
                    placeholder="Select a property"
                    className="w-full"
                    optionLabel="name"
                    disabled={!edit}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="requestDate" className="block input-label">
                    Request Date
                  </label>
                  <Calendar
                    value={selectedDate}
                    dateFormat="mm/dd/yy"
                    showIcon
                    onChange={handleDateChange}
                    className="w-full"
                    disabled={!edit}
                  />
                </div>
                <div>
                  <label htmlFor="requestTime" className="block input-label">
                    Request Time
                  </label>
                  <Calendar
                    value={selectedTime}
                    onChange={handleTimeChange}
                    showTime
                    hourFormat="24"
                    showIcon
                    timeOnly
                    className="w-full"
                    disabled={!edit}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="formOfNotification"
                    className="block input-label"
                  >
                    Form of Notification
                  </label>
                  <Dropdown
                    id="formOfNotification"
                    value={selectedRequest.formOfNotification}
                    options={notificationOptions}
                    onChange={onNotificationChange}
                    placeholder="Select a notification method"
                    valueTemplate={selectedOptionTemplate}
                    itemTemplate={optionTemplate}
                    className="w-full"
                    disabled={!edit}
                  />
                </div>
                <div>
                  <label htmlFor="responsible" className="block input-label">
                    Responsible
                  </label>
                  <Dropdown
                    id="responsible"
                    value={selectedUser}
                    options={users}
                    onChange={onUserChange}
                    optionLabel="name"
                    placeholder="Select an Agent"
                    className="w-full"
                    itemTemplate={userOptionTemplate}
                    valueTemplate={userValueTemplate}
                    disabled={!edit}
                  />
                </div>
              </div>
              <div className="flex gap-4 w-full">
                <div className="w-1/3">
                  <label
                    htmlFor="estipulatedTime"
                    className="block input-label"
                  >
                    Hours Estipulated
                  </label>
                  <InputNumber
                    id="estipulatedTime"
                    label="Estipulated"
                    variant="outlined"
                    aria-describedby="username-help"
                    mode="decimal"
                    showButtons
                    disabled={!edit}
                    max={24}
                    value={selectedRequest.estipulatedTime}
                    inputStyle={{ width: "100px" }}
                    onChange={(e) => {
                      setSelectedRequest((prevRequest) => ({
                        ...prevRequest,
                        estipulatedTime: e.value,
                      }));
                      setNewRequest(selectedRequest);
                    }}
                    className="w-full"
                  />
                </div>
                <div className="w-2/3">
                  <label htmlFor="state" className="block input-label mb-2">
                    State of Request
                  </label>
                  <Stack direction="row" spacing={1}>
                    {statuses.map((status) => (
                      <CustomChip
                        /*   disabled={addNewRequest & !edit} */
                        disabled={!edit}
                        key={status.label}
                        label={status.label}
                        color={status.color}
                        selected={activeStatus === status.label}
                        onClick={() => {
                          setNewRequest(selectedRequest);
                          handleStatusChange(status.label);
                        }}
                      />
                    ))}
                  </Stack>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="priority" className="block input-label">
                    Priority
                  </label>
                  <Dropdown
                    id="priority"
                    value={selectedRequest.priority}
                    options={["Low", "Medium", "High"]}
                    onChange={(e) => {
                      setSelectedRequest((prevStatus) => ({
                        ...prevStatus,
                        priority: e.value,
                      }));
                      setNewRequest(selectedRequest);
                    }}
                    placeholder="Select a priority level"
                    className="w-full"
                    disabled={!edit}
                  />
                </div>
                <div className="flex flex-col items-center input-label">
                  <div
                    className="card-clock bg-dark border"
                    style={{ borderColor: getColor(selectedRequest.deadline) }}
                  >
                    <p
                      className="day-text"
                      style={{ color: getColor(selectedRequest.deadline) }}
                    >
                      Time Remaining
                    </p>
                    <p
                      className="time-text"
                      style={{ color: getColor(selectedRequest.deadline) }}
                    >
                      <span>{selectedRequest.deadline}</span>
                    </p>
                    <FaClock
                      style={{ color: getColor(selectedRequest.deadline) }}
                      className="moon"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </Box>
  );
};

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  backgroundColor: "white",
  padding: "16px 12px 24px",
  boxShadow: "0 3px 6px rgba(0, 0, 0, 0.16)",
};

export default RequestForm;

export const getColor = (deadline) => {
  const [hours, minutes] = deadline?.split(":").map(Number) || [0, 0];

  if (hours <= 0 && hours <= 1) {
    return " #FF4C4C";
  } else if (hours >= 2 && hours < 4) {
    return "orange";
  } else {
    return "#22A06B";
  }
};

// Añadir animación de rebote usando keyframes en CSS
const styles = `
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-10px);
    }
    60% {
      transform: translateY(-5px);
    }
  }
`;

// Inyectar los estilos al documento
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
