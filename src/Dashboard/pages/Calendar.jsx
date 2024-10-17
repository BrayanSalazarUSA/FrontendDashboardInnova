import React, { useEffect, useState, useRef } from 'react'
import FullCalendar from '@fullcalendar/react'; // Para renderizar el calendario
import dayGridPlugin from '@fullcalendar/daygrid'; // Para la vista de día completo
import timeGridPlugin from '@fullcalendar/timegrid'; // Para la vista de horas
import interactionPlugin from '@fullcalendar/interaction'; // Para la interacción del calendario
import { InputLabel, OutlinedInput } from '@material-ui/core';
import "../pages/css/Calendar.css"
import { getAgents } from "../helper/getAgents";
import { Box, Button, Checkbox, FormControl, ListItemText, MenuItem, Modal, Select, Typography } from '@mui/material';
import { Calendar } from "primereact/calendar";

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
 
function getStyles(name, personName, theme) {
  return {
    fontWeight: personName.includes(name)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
}
 
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


const CalendarPage = () => {
 
  const [events, setEvents] = useState([]);
  const [open, setOpen] = useState(true);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [shift, setShift] = useState("");
  const [openInput, setOpeninput] = useState(false);
  const [personal, setPersonal] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState("");
  const [dates, setDates] = useState(null);
  const [agents, setAgents] = useState([]);
  const calendarRef = useRef(null);

useEffect(() => {
  
}, [events])
 
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
 
  const handleChange = (event) => {
    setSelectedPerson(event.target.value);
  };
 
  const summitCaptureShift = () => { };
 
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
 
  const handleEventSummit = (event) => {
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
 
 
 
 
    const newEvent = {
      title: turno,
      start: `2024-10-16T${horaInicio}`,
      end: `2024-10-16T${horaFinal}`,
      extendedProps: {
        participants: personal,
      },
      className: estilohorario,
    };
 
    let calendarApi = calendarRef.current.getApi(); // Obtener la API del calendario
    calendarApi.addEvent(newEvent);
    //setEvents([...events, newEvent]);
 
    handleClose()
  };
 
  ///// fech a los ususarios para mostralos en el backend
  const fechtAgents = async () => {
    const agentsResponse = await getAgents();
    setAgents(agentsResponse);
  };
 
  useEffect(() => {
    fechtAgents();
  }, []);
 
  /* useEffect(() => {
    console.log(dates)
  }, [events, dates]);*/

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
    if (window.confirm(`Eliminar turno de ${clickInfo.event.title}?`)) {
      //////
      setEvents(events.filter((event) => event.id !== clickInfo.event.id)); // Para eliminar eventos  //////// para eliminar el objeto de la lista que es el evento list events
      clickInfo.event.remove(); //////remover el calendario del evento  ,
      console.log(clickInfo);
    }
  };


  return (
    <div> <div>
    <h2 className='text-3xl font-semibold mb-2 m-auto flex justify-center text-[#a47f11]'>Calendario de Horarios de Empleados</h2>
  <div className='mx-4 my-2'>
  <Button variant="contained" onClick={handleOpen}>
            Turnos
          </Button>
 
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
                  onClick={handleEventSummit}
                >
                  Agregar Un turno
                </Button>
              </Typography>
            </Box>
          </Modal>
          <FullCalendar
            ref={calendarRef} // Añadir la referencia al calendari
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
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
                          {participant.Name || "Nombre"}
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
  </div></div>
  )
}

export default CalendarPage