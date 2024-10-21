import React, { useEffect, useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react"; // Para renderizar el calendario
import dayGridPlugin from "@fullcalendar/daygrid"; // Para la vista de día completo
import timeGridPlugin from "@fullcalendar/timegrid"; // Para la vista de horas
import interactionPlugin from "@fullcalendar/interaction"; // Para la interacción del calendario
import {
  InputLabel,
  List,
  ListItem,
  ListItemIcon,
  OutlinedInput,
} from "@material-ui/core";
import "../pages/css/Calendar.css";
import { getAgents } from "../helper/getAgents";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  ListItemText,
  MenuItem,
  Modal,
  Select,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import { Calendar } from "primereact/calendar";
import { getCalendar } from "../helper/Calendar/getCalendar";
import { postCalendar } from "../helper/Calendar/postCalendar";

import EditIcon from "@mui/icons-material/Edit";
import SnoozeIcon from "@mui/icons-material/Snooze";
import NoteIcon from "@mui/icons-material/Note";
import { deleteCalendar } from "../helper/Calendar/deleteCalendar";

const styleMenu = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 300,
  bgcolor: "background.paper",
  borderRadius: "10px",
  boxShadow: 24,
  p: 2,
};

const CalendarPage = () => {
  const [events, setEvents] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [shift, setShift] = useState("");
  const [openInput, setOpeninput] = useState(false);
  const [personal, setPersonal] = useState([]);
  const [dates, setDates] = useState(null);
  const [agents, setAgents] = useState([]);
  const calendarRef = useRef(null);
  const [event, setEvent] = useState();
  const [anchorEl, setAnchorEl] = useState(null);
  const openContext = Boolean(anchorEl);

  const [openMenu, setOpenMenu] = useState(false);
  const handleOpenMenu = () => setOpenMenu(true);
  const handleCloseMenu = () => setOpenMenu(false);

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    Height: "100",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 20,
    p: 4,
    Padding: "5m 5em 5m",
  };

  useEffect(() => {
    fetchCalendar();
    fechtAgents();
  }, []);

  //Nota, los metodos anteriores deben hacer que el comoponente se refreseque
  //Para que el useEffect se vuelva a ejecutar y llame la lista del backend
  //Actualizada con los datos nuevos

  // Referencia a FullCalendar
  const handleChangeInput = (event) => {
    setShift(event.target.value);
  };
  const handleCloseInput = () => {
    setOpeninput(false);
  };
  const handleOpenInput = () => {
    setOpeninput(true);
  };

  const handleChangesPersonal = (event) => {
    const {
      target: { value },
    } = event;
    setPersonal(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );

    console.log(personal);
    console.log(shift);
    console.log(dates);
  };

  const handleEventSummit = async (event) => {
    let estilohorario;

    let turno;
    switch (shift) {
      case "06:00-14:00":
        turno = "Turno Manañan";
        estilohorario = " event-morning";
        break;
      case "14:00-22:00":
        turno = "Turno Tarde";

        estilohorario = "event-afternoon";
        break;
      case "22:00-06:00":
        turno = "Turno Noche";
        estilohorario = "event-night";
        break;

      default:
        turno = "No ingresaste el turno";
        estilohorario = "no existe horario";
    }
    let horaInicio = shift.split("-")[0]; //06:00
    let horaFinal = shift.split("-")[1]; //14:00

    // Verifica si se seleccionó un rango de fechas o un solo día
    let startCalendar = new Date(dates[0]);
    let endCalendar =
      dates[1] && dates[1] !== null ? new Date(dates[1]) : startCalendar; // Si dates[1] es null, usamos startCalendar

    // Función para agregar eventos
    const addEvent = (currentDate) => {
      // Si el turno es el de la noche (22:00 - 06:00)
      if (shift === "22:00-06:00") {
        // La fecha de inicio es el día seleccionado (currentDate)
        let startDate = currentDate.toISOString().split("T")[0]; // Ejemplo: "2024-10-30"

        // La fecha de finalización debe ser el día siguiente
        let nextDay = new Date(currentDate);
        nextDay.setDate(currentDate.getDate() + 1); // Avanzar un día

        // La fecha final con la hora "06:00" del siguiente día
        let finalShiftDate = nextDay.toISOString().split("T")[0]; // Ejemplo: "2024-10-31"

        // Crear el nuevo evento para el turno de noche
        const newEvent = {
          title: "Turno Noche",
          start: `${startDate}T${horaInicio}`, // Ejemplo: "2024-10-30T22:00"
          end: `${finalShiftDate}T06:00`, // Ejemplo: "2024-10-31T06:00"
          extendedProps: {
            participants: personal,
          },
          className: "event-night",
        };

        // Agregar el evento al calendario
        let calendarApi = calendarRef.current.getApi();
        calendarApi.addEvent(newEvent);
      } else {
        // Para turnos que no son de noche
        let startDate = currentDate.toISOString().split("T")[0]; // Fecha de inicio y fin el mismo día

        // Crear el nuevo evento para otros turnos (mañana o tarde)
        const newEvent = {
          title: turno,
          start: `${startDate}T${horaInicio}`, // Ejemplo: "2024-10-30T06:00"
          end: `${startDate}T${horaFinal}`, // Ejemplo: "2024-10-30T14:00"
          extendedProps: {
            participants: personal,
          },
          className: estilohorario,
        };

        // Agregar el evento al calendario
        let calendarApi = calendarRef.current.getApi();
        postCalendar(newEvent);
        setEvents([...events, newEvent]);
        //calendarApi.addEvent(newEvent);
      }
    };

    // Si hay más de un día seleccionado, generar eventos para cada día
    if (startCalendar.getTime() !== endCalendar.getTime()) {
      console.log("Mas de un evento");
      // Recorrer el rango de fechas, día por día
      let currentDate = startCalendar;
      while (currentDate <= endCalendar) {
        addEvent(new Date(currentDate)); // Agregar el evento para el día actual
        currentDate.setDate(currentDate.getDate() + 1); // Moverse al siguiente día
      }
      console.log("Mas de un evento");
    } else {
      // Si es un solo día, agregar solo un evento
      addEvent(startCalendar);
    }
    // Cerrar el modal o interfaz
    handleClose();
  };

  ///// fech a los ususarios para mostralos en el backend
  const fechtAgents = async () => {
    const agentsResponse = await getAgents();
    setAgents(agentsResponse);
  };

  const fetchCalendar = async () => {
    const calendar = await getCalendar();
    setEvents(calendar);
  };

  // Función para manejar la creación de eventos
  const handleDateSelect = (selectInfo) => {
    const title = prompt("Asignar empleado al turno: ");
    if (title) {
      const newEvent = {
        id: Date.now(), // ID único para el evento
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
      };
      setEvents([...events, newEvent]); // Actualiza el estado con el nuevo evento
    }
  };

  // Función para manejar el drag-and-drop de eventos
  const handleEventDrop = (info) => {
    const updatedEvents = events.map((event) =>
      event.id === info.event.id
        ? {
            ...event,
            start: info.event.startStr,
            end: info.event.endStr,
          }
        : event
    );
    setEvents(updatedEvents); // Actualiza el estado con los eventos arrastrados
  };

  // Función para eliminar un evento
  const handleEventClick = (clickInfo) => {
    setEvent(clickInfo.event);
    console.log(event);
    handleOpenMenu();
  };

  const handleCloseContext = () => {
    setAnchorEl(null);
  };


  const handleEditShift = () => {
    //Editar turno por medio del updateCalendar.js removiendo o agregando personal,
    //cambiando fechas o la hora.te
    //Debera abrir el modal con eel formulario y mapear o inicializar los datos del evento
    //para asi poder editarlo. (Opciones, almacenandolo en un contexto o estado)
    //Y luego accediendo desde el moda o formulario
  };

  const handleAddOffDay = () => {
     //Editar turno por medio del updateCalendar.js asignandole una persona
  };    

  const handleAddNote = () => {
     //Editar turno por medio del updateCalendar.js agregandole una nota
  };

  const handleDeleteShift = () => {
        console.log(event);
        console.log("Event")
         let shiftID = returnObjectMapped(event).id || 0
        deleteCalendar(shiftID)
        event.remove()
        handleCloseMenu()
  };

  const returnObjectMapped = (event) => {
   // Extraer los valores de interés del objeto evento
   const eventId = event._def.publicId || event._def.id || event.id; // Extraer el ID único del evento
   const startDate = event.startStr.split('T')[0]; // Extraer solo la fecha de inicio
   const horaInicio = event.startStr.split('T')[1]; // Extraer la hora de inicio
   const finalShiftDate = event.endStr.split('T')[0]; // Extraer solo la fecha de fin
   const personal = event.extendedProps.participants || []; // Asumimos que participants está en extendedProps
 
   // Crear el nuevo objeto con el formato necesario
   const newEvent = {
     id:eventId,
     title: "Turno Noche", // Este título parece estar fijo
     start: `${startDate}T${horaInicio}`, // Ejemplo: "2024-10-30T22:00"
     end: `${finalShiftDate}T06:00`, // Ejemplo: "2024-10-31T06:00"
     extendedProps: {
       participants: personal, // Participantes extraídos de extendedProps
     },
     className: "event-night", // Clase CSS
   };
 
   return newEvent;
  }
  return (
    <div>
      <div>
        <h2 className="text-3xl font-semibold mb-2 m-auto flex justify-center text-[#a47f11]">
          Calendario de Horarios de Empleados
        </h2>
        <div className="mx-4 my-2">
          <Button variant="contained" onClick={handleOpen}>
            Turnos
          </Button>

          <Modal
            open={openMenu}
            onClose={handleCloseMenu}
            aria-labelledby="modal-menu-title"
            aria-describedby="modal-menu-description"
          >
            <Box sx={styleMenu}>
              <Typography
                id="modal-menu-title"
                variant="h6"
                component="h2"
                align="center"
                gutterBottom
              >
                Opciones del Calendario
              </Typography>
              <List>
                <ListItem button onClick={() => console.log("Editar")}>
                  <ListItemIcon>
                    <EditIcon />
                  </ListItemIcon>
                  <ListItemText primary="Editar" />
                </ListItem>

                <ListItem button onClick={handleDeleteShift}>
                  <ListItemIcon>
                    <DeleteIcon />
                  </ListItemIcon>
                  <ListItemText primary="Eliminar" />
                </ListItem>

                <ListItem button onClick={() => console.log("Descanso")}>
                  <ListItemIcon>
                    <SnoozeIcon />
                  </ListItemIcon>
                  <ListItemText primary="Descanso" />
                </ListItem>

                <ListItem button onClick={() => console.log("Nota")}>
                  <ListItemIcon>
                    <NoteIcon />
                  </ListItemIcon>
                  <ListItemText primary="Nota" />
                </ListItem>
              </List>
            </Box>
          </Modal>

          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                <FormControl sx={{ m: 1, minWidth: 350 }}>
                  <InputLabel id="demo-controlled-open-select-label">
                    Turno
                  </InputLabel>
                  <Select
                    labelId="demo-controlled-open-select-label"
                    id="demo-controlled-open-select"
                    open={openInput}
                    onClose={handleCloseInput}
                    onOpen={handleOpenInput}
                    value={shift}
                    label="Age"
                    onChange={handleChangeInput}
                  >
                    <MenuItem value=""></MenuItem>
                    <MenuItem value={"06:00-14:00"}>Manaña</MenuItem>
                    <MenuItem value={"14:00-22:00"}>Tarde</MenuItem>
                    <MenuItem value={"22:00-06:00"}>Noche</MenuItem>
                  </Select>
                </FormControl>
                <br />
                <FormControl sx={{ m: 1, width: 350 }}>
                  <InputLabel id="demo-multiple-checkbox-label">
                    Personal
                  </InputLabel>
                  <Select
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple
                    value={personal}
                    onChange={handleChangesPersonal}
                    input={<OutlinedInput label="Agents" />}
                    renderValue={(selected) =>
                      selected.map((agent) => agent.Name).join(", ")
                    }
                    seleccionadosMenuProps={MenuProps}
                  >
                    {agents.map((agent) => (
                      <MenuItem key={agent.Name} value={agent}>
                        <Checkbox
                          checked={personal.some(
                            (selectedAgent) => selectedAgent.Name === agent.Name
                          )}
                        />
                        <ListItemText primary={agent.Name} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <br />

                <div className="card flex justify-content-center">
                  <Calendar
                    value={dates}
                    onChange={(e) => setDates(e.value)}
                    selectionMode="range"
                    readOnlyInput
                    hideOnRangeSelection
                  />
                </div>
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                <br />
                <Button
                  variant="contained"
                  type="summit"
                  onClick={handleEventSummit}>
                  Agregar Un turno
                </Button>
              </Typography>
            </Box>
          </Modal>
          <FullCalendar
            ref={calendarRef} // Añadir la referencia al calendari
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            firstDay={1} // Configura el lunes como el primer día de la semana
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            events={events}
            eventContent={(eventInfo) => {
              // Accediendo a las propiedades adicionales
              const { participants, offUser } = eventInfo.event.extendedProps;
              return (
                <div className="p-2">
                  <div className="text-gray-800 ">
                    <b>{eventInfo.timeText}</b>
                  </div>
                  <div className="text-gray-700 font-bold">
                    {eventInfo.event.title}
                  </div>
                  <div style={{ fontSize: "0.8em", color: "black" }}>
                    Participantes :
                    {participants &&
                      participants.map((participant, index) => (
                        <span key={index}>
                          {participant.name || "Nombre"}
                          {index < participants.length - 1 ? ", " : ""}
                        </span>
                      ))}
                  </div>
                  {offUser && (
                    <div style={{ fontSize: "0.7em", color: "black" }}>
                      <b>{offUser} OFF (Descanso)</b>
                    </div>
                  )}
                </div>
              );
            }}
            allDaySlot={false}
            slotMinTime="06:00:00" // Comienza la vista desde las 00:00
            slotMaxTime="30:00:00" // Termina la vista a las 23:59, mostrando las 24 horas completas
            scrollTime="06:00:00" // Inicia el scroll a las 6:00 AM
            slotDuration="01:00:00" // Muestra intervalos de 1 hora
            nowIndicator={true}
            select={handleDateSelect} // Para agregar un nuevo turno
            eventDrop={handleEventDrop} // Para mover eventos
            eventClick={handleEventClick} // Para eliminar eventos
            className="m-3"
          />
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
