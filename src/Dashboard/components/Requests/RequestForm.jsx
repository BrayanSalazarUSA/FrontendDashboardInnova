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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Confetti from 'react-confetti';
const notificationOptions = [
  {
    label: "Dashboard",
    value: "dashboard",
    icon: "pi pi-desktop",
    color: "#d6aa25",
  },
  {
    label: "WhatsApp",
    value: "whatsapp",
    icon: "pi pi-whatsapp",
    color: "#25D366",
  },
  { label: "Email", value: "email", icon: "pi pi-envelope", color: "#0078D4" },
  { label: "Call", value: "call", icon: "pi pi-phone", color: "#34B7F1" },
  { label: "Text", value: "text", icon: "pi pi-comment", color: "#757575" },
];
// Lista de usuarios
/* const users = [
  { id: 2, name: "Danny Lopez", image: "profiles/danny.webp" },
  { id: 5, name: "Maria Ospina", image: "profiles/Maria.webp" },
  { id: 6, name: "Edilson Gomez", image: "profiles/Screenshot_2024-06-27_113511.png" },
  { id: 7, name: "Laura Franco", image: "profiles/Imagen_de_WhatsApp_2024-06-17_a_las_14.54.38_95293b4a.jpg" },
  { id: 8, name: "Sebastian Garcia", image: "profiles/Imagen_de_WhatsApp_2024-06-17_a_las_14.55.34_4f243efa.jpg" },
  { id: 9, name: "Carolina Hurtado", image: "profiles/profile-defualt.png" },
  { id: 10, name: "Santiago Alarcon", image: "profiles/profile-defualt.png" },
  { id: 11, name: "Brysse Suarez", image: "profiles/profile-defualt.png" },
  { id: 12, name: "Brayan Salazar Rivas", image: "profiles/profile.png" }
]; */
const statuses = [
  { label: "Not Started", color: "gray" },
  { label: "In Process", color: "#1D7AFC" },
  { label: "Completed", color: "#22A06B" },
];

const CustomChip = styled(Chip)(({ selected, color }) => ({
  backgroundColor: selected ? color : "#e0e0e0",
  color: selected ? "white" : "black",
  fontWeight: selected ? "bold" : "normal",
  "&:hover": {
    backgroundColor: selected ? color : "#d5d5d5",
  },
}));

const RequestForm = ({ selectedRequest, setSelectedRequest }) => {
  const [properties, setProperties] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(
    selectedRequest.property
  );
  const userSession = JSON.parse(localStorage.getItem("user"));
  const [selectedUser, setSelectedUser] = useState(selectedRequest.responsible);
  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [activeStatus, setActiveStatus] = useState(selectedRequest.state);

  const { t } = useTranslation("global");

  /* useEffect(() => {
   
    const fetchData = async () => {
      try {
        const propertiesResponse = await getPropertiesInfo();
        setProperties(propertiesResponse);

         const agentsResponse = await getUsersDTO();
         console.log(agentsResponse)
        setUsers(agentsResponse);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); */

  useEffect(() => {
    const fetchUsers = async () => {
      const agentsResponse = await getUsersDTO(); // Suponiendo que getUsersDTO es una función que hace la petición
      setUsers(agentsResponse);
      const initialUser = agentsResponse.find(
        (user) => user.id === selectedRequest.responsible.id
      );
      setSelectedUser(initialUser);
      const propertiesResponse = await getPropertiesInfo();
      setProperties(propertiesResponse);
      const initialProperty = propertiesResponse.find(
        (property) => property.id === selectedRequest.property.id
      );
      setSelectedProperty(initialProperty);
    };
    setSelectedUser(selectedRequest.responsible);
    if (selectedRequest.requestDate) {
      setSelectedDate(new Date(selectedRequest.requestDate));
    }
    if (selectedRequest.requestTime) {
      setSelectedTime(stringToTime(selectedRequest.requestTime));
    }
    fetchUsers();

    console.log("selectedRequest");
    console.log(selectedRequest);
  }, [selectedRequest]);

  const onUserChange = (e) => {
    setSelectedUser(e.value);

    setSelectedRequest((prevStatus) => ({
      ...prevStatus,
      responsible: e.value,
    }));
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
  };

  const handleTimeChange = (e) => {
    const newTime = e.value;
    setSelectedTime(newTime);
    setSelectedRequest((prevRequest) => ({
      ...prevRequest,
      requestTime: formatTime(newTime),
    }));
  };

  const onPropertyChange = (e) => {
    /* const selectedProp = properties.find((prop) => prop.id === e.value); */
    setSelectedProperty(e.value);
    setSelectedRequest((prevRequest) => ({
      ...prevRequest,
      property: e.value,
    }));
  };

  const onNotificationChange = (e) => {
    setSelectedRequest({ ...selectedRequest, formOfNotification: e.value });
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

  const getColor = (deadline) => {
    const [hours, minutes] = deadline.split(":").map(Number);

    if (hours <= 0 && hours <= 1) {
      return " #FF4C4C";
    } else if (hours >= 2 && hours < 4) {
      return "orange";
    } else {
      return "#22A06B";
    }
  };

  const CustomChip = styled(Chip)(({ selected, color }) => ({
    backgroundColor: selected ? color : "#e0e0e0",
    color: selected ? "white" : "black",
    fontWeight: selected ? "bold" : "normal",
    "&:hover": {
      backgroundColor: selected ? color : "#d5d5d5",
    },
  }));

  const handleStatusChange = (status) => {
    setActiveStatus(status);
    setSelectedRequest((prevRequest) => ({
      ...prevRequest,
      state: status,
    }));

    let userName = userSession?.name?.split(' ')[0] || '';

    if(status == 'Completed'){
      toast.success(`Congratulations ${userName}! You have completed your task.`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000); // Stop the confetti after 5 seconds
    }
  };
  return (
    <Box style={modalStyle}>
      {selectedRequest && (
        <section className="relative bg-request bg-no-repeat bg-cover bg-center p-10">
          <video
            autoPlay
            loop
            muted
            className="absolute top-0 left-0 w-full h-full object-cover z-0"
          >
            <source src={video} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="relative container rounded-xl w-full sm:w-10/12 grid bg-dark px-5 sm:px-6 mx-auto lg:grid-cols-2 z-10 animated-border">
            <div className="w-1/2">
              <div className="p-3">
                <img
                  src={logo}
                  className="w-[200px] object-contain ml-[-20px]"
                />
               
                <h1 className="mt-2 text-2xl font-semibold text-gray-300 md:text-2xl dark:text-white">
                  Make a request
                </h1>
                <p className="my-3 text-gray-300">
                  Below please write a Detailed description of the investigation
                  being requested
                </p>
                <InputTextarea
                  id="details"
                  value={selectedRequest.details}
                  rows={11}
                  cols={45}
                  onChange={(e) =>
                    setSelectedRequest((prevStatus) => ({
                      ...prevStatus,
                      details: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="w-1/2 pb-5">
              <div className="flex flex-row">
                <div className="flex flex-col w-[310px]">
                  <span
                    className="identification-id w-full"
                    style={{
                      margin: " 15px 0px",
                      padding: "5px 15px",
                      border: "1px double #835c0e",
                      borderRadius: "8px",
                    }}
                  >
                    Investigation ID: {selectedRequest.identification}
                  </span>
                </div>
              </div>
              <div className="flex flex-row">
                <div className="flex flex-col w-[200px]">
                  <label htmlFor="client" className="label-input-request">
                    Client
                  </label>
                  <InputText
                    id="client"
                    label="Client"
                    variant="outlined"
                    placeholder="Client"
                    required
                    margin="normal"
                    value={selectedRequest.client}
                    onChange={(e) =>
                      setSelectedRequest((prevRequest) => ({
                        ...prevRequest,
                        client: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="flex flex-col ml-3">
                  <label htmlFor="property" className="label-input-request">
                    Property
                  </label>
                  <Dropdown
                    id="property"
                    value={selectedProperty}
                    options={properties}
                    onChange={onPropertyChange}
                    placeholder="Select a property"
                    className="w-52"
                    optionLabel="name"
                  />
                </div>
              </div>
              <div className="flex flex-row">
                <div className="flex flex-col w-[200px]">
                  <div className="flex-auto">
                    <label
                      htmlFor="buttondisplay"
                      className="label-input-request"
                    >
                      Request Date
                    </label>
                    <Calendar
                      value={selectedDate}
                      dateFormat="mm/dd/yy"
                      showIcon
                      onChange={handleDateChange}
                    />
                  </div>
                </div>
                <div className="flex flex-col ml-3 w-[200px]">
                  <div className="flex-auto">
                    <label
                      htmlFor="buttondisplay"
                      className="label-input-request"
                    >
                      Request Time
                    </label>
                    <Calendar
                      value={selectedTime}
                      onChange={handleTimeChange}
                      showTime
                      hourFormat="24"
                      showIcon
                      timeOnly
                      className="w-52"
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-row">
                <div className="flex flex-col w-[200px]">
                  <label
                    htmlFor="formOfNotification"
                    className="label-input-request"
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
                    className="w-full z-position"
                    defaultValue={"dashboard"}
                  />
                </div>
                <div className="flex flex-col ml-3">
                  <label htmlFor="responsible" className="label-input-request">
                    Responsible
                  </label>
                  <Dropdown
                    id="responsible"
                    value={selectedUser}
                    options={users}
                    onChange={onUserChange}
                    optionLabel="name"
                    placeholder="Select an Agent"
                    className="w-52"
                    itemTemplate={userOptionTemplate}
                    valueTemplate={userValueTemplate}
                  />
                </div>
              </div>
              <div className="flex flex-col lg:flex-row gap-3 w-full">
                <div className="flex flex-col">
                  <label
                    htmlFor="estipulatedTime"
                    className="label-input-request"
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
                    max={72}
                    value={selectedRequest.estipulatedTime}
                    inputStyle={{ width: "80px" }}
                    onChange={(e) =>
                      setSelectedRequest((prevRequest) => ({
                        ...prevRequest,
                        estipulatedTime: e.value,
                      }))
                    }
                  />
                </div>
                <div className="flex flex-col ml-2">
                  <label htmlFor="state" className="label-input-request">
                    State of Request
                  </label>
                  <div className="flex mt-3">
                    <Stack direction="row" spacing={1}>
                      {statuses.map((status) => (
                        <CustomChip
                          key={status.label}
                          label={status.label}
                          color={status.color}
                          selected={activeStatus === status.label}
                          onClick={() => handleStatusChange(status.label)}
                        />
                      ))}
                    </Stack>
                  </div>
                </div>
              </div>
              <div className="flex flex-row">
                <div className="flex flex-col w-[200px]">
                  <label htmlFor="priority" className="label-input-request">
                    Priority
                  </label>
                  <Dropdown
                    id="Priority"
                    value={selectedRequest.priority}
                    options={["Low", "Medium", "High"]}
                    onChange={(e) =>
                      setSelectedRequest((prevStatus) => ({
                        ...prevStatus,
                        priority: e.value,
                      }))
                    }
                    placeholder="Select a priority level"
                    className="w-full z-position"
                  />
                </div>
                <div className="flex flex-col ml-3 text-white">
                  <div
                    class="card-clock bg-dark "
                    style={{
                      border: "1px solid",
                      borderColor: getColor(selectedRequest.deadline),
                    }}
                  >
                    <p
                      class="day-text"
                      style={{ color: getColor(selectedRequest.deadline) }}
                    >
                      Time Remaining
                    </p>
                    <p
                      class="time-text"
                      style={{ color: getColor(selectedRequest.deadline) }}
                    >
                      <span>{selectedRequest.deadline}</span>
                      <span class="time-sub-text"></span>
                    </p>
                    <FaClock
                      style={{ color: getColor(selectedRequest.deadline) }}
                      className=" moon"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ToastContainer />
            {showConfetti && <Confetti />}
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
