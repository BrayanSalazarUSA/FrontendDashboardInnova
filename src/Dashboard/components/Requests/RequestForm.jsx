import React, { useEffect, useState } from "react";
import { Stack } from "@mui/material";
import { Calendar } from "primereact/calendar";
import {
  Typography,
  Modal,
  Box,
  TextareaAutosize,
  InputLabel,
  Select,
  Chip,
  styled,
} from "@material-ui/core";

import { TextField, Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputTextarea } from "primereact/inputtextarea";
import { InputSwitch } from "primereact/inputswitch";
import { useTranslation } from "react-i18next";


const options = [
  { label: 'Dashboard', value: 'whatsapp', icon: 'pi pi-desktop', color:"#d6aa25" },
  { label: 'WhatsApp', value: 'dashboard', icon: 'pi pi-whatsapp', color:"#25D366" },
  { label: 'Email', value: 'email', icon: 'pi pi-envelope', color:"#0078D4" },
  { label: 'Call', value: 'call', icon: 'pi pi-phone',color:"#34B7F1" },
  { label: 'Text', value: 'text', icon: 'pi pi-comment', color:"#757575" }
];


const RequestForm = ({ selectedRequest, setSelectedRequest }) => {
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState();
  const { t } = useTranslation("global");
  // Función para convertir una cadena de fecha en formato "MM-dd-yyyy" a un objeto Date

  // Función para convertir una cadena de tiempo en formato "HH:mm" a un objeto Date
  const formatDate = (date) => {
    if (typeof date === "string") {
      date = new Date(date);
    }
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${month}-${day}-${date.getFullYear()}`;
  };

  const formatTime = (date) => {
    if (!date) {
      return null; // Retorna null directamente si la fecha es null o undefined
    }
    if (typeof date === "string") {
      date = new Date(date);
    }
    let hours = date.getHours().toString().padStart(2, "0");
    let minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const statuses = [
    { label: "Not Started", color: "gray" },
    { label: "In Process", color: "#1D7AFC" },
    { label: "Completed", color: "#22A06B" },
  ];
  const [activeStatus, setactiveStatus] = useState();

  const CustomChip = styled(Chip)(({ selected, color }) => ({
    backgroundColor: selected ? color : "#e0e0e0",
    color: selected ? "white" : "black",
    fontWeight: selected ? "bold" : "normal",
    "&:hover": {
      backgroundColor: selected ? color : "#d5d5d5",
    },
  }));


    const onNotificationChange = (e) => {
      setSelectedRequest({ ...selectedRequest, formOfNotification: e.value });
    };

    const selectedOptionTemplate = (option) => {
      if (option) {
        return (
          <div className="flex align-items-center">
          <i className={`${option.icon} mr-2 rounded-full p-2`} style={{ backgroundColor: option.color, color: "white" }}></i>
          <span style={{ color: option.color }}>{option.label}</span>
        </div>
        );
      }
      return <span>Notification method</span>;
    };
    const optionTemplate = (option) => {
      return (
        <div className="flex align-items-center">
          <i className={`${option.icon} mr-2 rounded-full p-2`} style={{ backgroundColor: option.color, color: "white" }}></i>
          <span style={{ color: option.color }}>{option.label}</span>
        </div>
      );
    };
  return (
    <Box style={modalStyle}>
      {/*   <Typography variant="h6" gutterBottom>
              Edit Request
          </Typography> */}
      {selectedRequest && (
        <section className="bg-request py-10 bg-no-repeat bg-cover bg-center my-3 ">
          <div className="container rounded-xl bg-half-transparent  w-full sm:w-10/12  grid gap-8 px-1 sm:px-6 py-12 mx-auto lg:grid-cols-2 ">
            <div className="w-1/2">
              <div className=" p-3 px-5">
                <p className="font-medium text-yellow-600 ">Request 2434</p>

                <h1 className="mt-2 text-2xl font-semibold text-gray-300 md:text-3xl dark:text-white">
                  Make a request
                </h1>

                <p className="my-3 text-gray-300">
                  {t("form_Page.friendly_Team")}
                </p>

                <InputTextarea
                  id="username"
                  value="Could you please check the footage of the trash chute there's a new floral couch left right next to the grey couch that was left on 07/17/2024.  It could have been left there either 07/18 - 07/21.
"
                  rows={12}
                  cols={50}
                />
            
              </div>
            </div>
            <div className="w-1/2 form-request">
              <div className="flex flex-row ">
                <div className="flex flex-col w-[210px]">
                  <span className="identification-id w-full">
                    ID: {selectedRequest.identification}
                  </span>
                </div>
              </div>

              <div className="flex flex-row ">
              <div className="flex flex-col w-[250px]">
      <label htmlFor="formOfNotification" className="label-input-request">
        Form of Notification
      </label>
      <Dropdown
        id="formOfNotification"
        value={selectedRequest.formOfNotification}
        options={options}
        onChange={onNotificationChange}
        placeholder="Select a notification method"
        valueTemplate={selectedOptionTemplate}
        itemTemplate={optionTemplate}
        className="w-full z-position"
      />
    </div>
                <div className="flex flex-col ml-3 min-w-1/2">
                  <div className="flex-auto">
                    <label
                      htmlFor="buttondisplay"
                      className="label-input-request"
                    >
                      Request Date
                    </label>

                    <Calendar
                      value={formatDate(selectedRequest.requestDate)}
                      dateFormat="mm/dd/yy"
                      showIcon
                      onChange={(e) =>
                        setSelectedDate({
                          ...selectedDate,
                          requestDate: formatDate(e.value),
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-row">
                <div className="flex flex-col ">
                  <div className="flex-auto">
                    <label
                      htmlFor="buttondisplay"
                      className="label-input-request"
                    >
                      Request Time
                    </label>

                    <Calendar
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.value)}
                      showTime
                      hourFormat="24"
                      showIcon
                      timeOnly
                      className="w-52"
                    />
                  </div>
                </div>
                <div className="flex flex-col ml-3">
                  <label htmlFor="property" className="label-input-request">
                    Property
                  </label>
                  <Dropdown
                    id="property"
                    label="Property"
                    variant="outlined"
                    required
                    className="w-52"
                    margin="normal"
                    options={["Gloerieta", "Aswan"]}
                    value={selectedRequest.property.name}
                  />
                </div>
              </div>

              <div className="flex flex-row">
                <div className="flex flex-col">
                  <label htmlFor="responsible" className="label-input-request">
                    Responsible
                  </label>
                  <InputText
                    id="responsible"
                    label="Responsable"
                    variant="outlined"
                    required
                    margin="normal"
                    value={selectedRequest.responsible.name}
                  />
                </div>
                {/* <div className="flex flex-col ml-3">
                  <label
                    htmlFor="isTimeFinished"
                    className="label-input-request"
                  >
                    Finished
                  </label>
                  <InputSwitch
                    checked={selectedRequest.timeFinished}
                     onChange={handleInternetChange} 
                    id="isTimeFinished"
                    variant="outlined"
                    className="mt-3"
                    disabled
                  />
                </div> */}

                <div className="flex flex-col ml-3">
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
                  />
                </div>
              </div>

              <div className="flex  flex-col lg:flex-row gap-3 w-full">
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
                    value={selectedRequest.estipulatedTime}
                    inputStyle={{ width: "80px" }}
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
                          onClick={() => setactiveStatus(status.label)}
                        />
                      ))}
                    </Stack>
                  </div>
                </div>
              </div>

              <div className="flex flex-row">
                <div className="flex flex-col ">
                  <label htmlFor="priority" className="label-input-request">
                    Priority
                  </label>
                  <InputText
                    id="priority"
                    label="Priority"
                    variant="outlined"
                    required
                    margin="normal"
                    value={selectedRequest.priority}
                  />
                </div>

                <div className="flex flex-col ml-3">
                  <label htmlFor="deadline" className="label-input-request">
                    Deadline
                  </label>
                  <InputText
                    id="deadline"
                    label={"Deadline"}
                    variant="outlined"
                    required
                    margin="normal"
                    value={selectedRequest.deadline}
                  />
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
