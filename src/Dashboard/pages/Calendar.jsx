import React, { useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'; // Para renderizar el calendario
import dayGridPlugin from '@fullcalendar/daygrid'; // Para la vista de día completo
import timeGridPlugin from '@fullcalendar/timegrid'; // Para la vista de horas
import interactionPlugin from '@fullcalendar/interaction'; // Para la interacción del calendario
import { createTheme } from '@material-ui/core';
import "../pages/css/Calendar.css"

const schedule = [
  {
    id: 1,
    title: 'Turno Morning',
    start: '2024-09-30T06:00:00',
    end: '2024-09-30T14:00:00',
    participants: [
      'Santiago Alarcon',
      'Aleska'
    ],
    offUser: 'Carolina',
    note: 'Carolina descansa este turno',
    className:"event-morning"
  },
  {
    id: 2,
    title: 'Turno Afternoon',
    start: '2024-09-30T14:00:00',
    end: '2024-09-30T22:00:00',
    participants: [
      'Edilson',
      'Ximena',
      'Alejandra Hernandez'
    ],
    offUser: null,
    note: null,
    className:"event-afternoon"
  },
  {
    id: 3,
    title: 'Turno Night',
    start: '2024-09-30T22:00:00',
    end: '2024-10-01T06:00:00',
    participants: [
      'Yusleidys',
      'Karen',
      'Carlos'
    ],
    offUser: 'Alejandra Grajales',
    note: 'Alejandra Grajales descansa este turno',
    className:"event-night"
  },
  {
    id: 4,
    title: 'Turno Morning',
    start: '2024-10-01T06:00:00',
    end: '2024-10-01T14:00:00',
    participants: [
      'Santiago Alarcon',
      'Aleska',
      'Carolina'
    ],
    offUser: null,
    note: null,
    className:"event-morning"
  },
  {
    id: 5,
    title: 'Turno Afternoon',
    start: '2024-10-01T14:00:00',
    end: '2024-10-01T22:00:00',
    participants: [
      'Ximena',
      'Alejandra Hernandez'
    ],
    offUser: 'Edilson',
    note: 'Edilson descansa este turno',
    className:"event-afternoon"
  },
  {
    id: 6,
    title: 'Turno Night',
    start: '2024-10-01T22:00:00',
    end: '2024-10-02T06:00:00',
    participants: [
      'Karen',
      'Carlos',
      'Alejandra Grajales'
    ],
    offUser: 'Yusleidys',
    note: 'Yusleidys descansa este turno',
    className:"event-night"
  },
  {
    id: 7,
    title: 'Turno Morning',
    start: '2024-10-02T06:00:00',
    end: '2024-10-02T14:00:00',
    participants: [
      'Aleska',
      'Carolina'
    ],
    offUser: 'Santiago Alarcon',
    note: 'Santiago Alarcon descansa este turno',
    className:"event-morning"
  },
  {
    id: 8,
    title: 'Turno Afternoon',
    start: '2024-10-02T14:00:00',
    end: '2024-10-02T22:00:00',
    participants: [
      'Edilson',
      'Ximena'
    ],
    offUser: 'Alejandra Hernandez',
    note: 'Alejandra Hernandez descansa este turno',
    className:"event-afternoon"
  },
  {
    id: 9,
    title: 'Turno Night',
    start: '2024-10-02T22:00:00',
    end: '2024-10-03T06:00:00',
    participants: [
      'Yusleidys',
      'Karen',
      'Carlos',
      'Alejandra Grajales'
    ],
    offUser: null,
    note: null,
    className:"event-night"
  },
  {
    id: 10,
    title: 'Turno Morning',
    start: '2024-10-03T06:00:00',
    end: '2024-10-03T14:00:00',
    participants: [
      'Santiago Alarcon',
      'Aleska',
      'Carolina'
    ],
    offUser: null,
    note: null,
    className:"event-morning"
  },
  {
    id: 11,
    title: 'Turno Afternoon',
    start: '2024-10-03T14:00:00',
    end: '2024-10-03T22:00:00',
    participants: [
      'Edilson',
      'Ximena',
      'Alejandra Hernandez'
    ],
    offUser: null,
    note: null,
     className:"event-afternoon"
  },
  {
    id: 12,
    title: 'Turno Night',
    start: '2024-10-03T22:00:00',
    end: '2024-10-04T06:00:00',
    participants: [
      'Yusleidys',
      'Karen',
      'Carlos',
      'Alejandra Grajales'
    ],
    offUser: 'Santiago Suarez',
    note: 'Santiago Suarez descansa este turno',
    className:"event-night"
  },
  {
    id: 13,
    title: 'Turno Morning',
    start: '2024-10-04T06:00:00',
    end: '2024-10-04T14:00:00',
    participants: [
      'Santiago Alarcon',
      'Aleska',
      'Carolina'
    ],
    offUser: null,
    note: null,
    className:"event-morning"
  },
  {
    id: 14,
    title: 'Turno Afternoon',
    start: '2024-10-04T14:00:00',
    end: '2024-10-04T22:00:00',
    participants: [
      'Edilson',
      'Ximena',
      'Alejandra Hernandez'
    ],
    offUser: null,
    note: null,
     className:"event-afternoon"
  },
  {
    id: 15,
    title: 'Turno Night',
    start: '2024-10-04T22:00:00',
    end: '2024-10-05T06:00:00',
    participants: [
      'Yusleidys',
      'Karen',
      'Carlos',
      'Alejandra Grajales'
    ],
    offUser: 'Santiago Suarez',
    note: 'Santiago Suarez descansa este turno',
    className:"event-night"
  },
   {
    id: 16,
    title: 'Turno Morning',
    start: '2024-10-05T06:00:00',
    end: '2024-10-05T14:00:00',
    participants: [
      'Santiago Alarcon',
      'Aleska',
      'Carolina'
    ],
    offUser: null,
    note: null,
    className:"event-morning"
  },
  {
    id: 17,
    title: 'Turno Afternoon',
    start: '2024-10-05T14:00:00',
    end: '2024-10-05T22:00:00',
    participants: [
      'Edilson',
      'Ximena',
      'Alejandra Hernandez'
    ],
    offUser: null,
    note: null,
     className:"event-afternoon"
  },
  {
    id: 18,
    title: 'Turno Night',
    start: '2024-10-05T22:00:00',
    end: '2024-10-06T06:00:00',
    participants: [
      'Yusleidys',
      'Karen',
      'Carlos',
      'Alejandra Grajales'
    ],
    offUser: 'Santiago Suarez',
    note: 'Santiago Suarez descansa este turno',
    className:"event-night"
  },
  {
    id: 19,
    title: 'Turno Morning',
    start: '2024-09-29T06:00:00',
    end: '2024-09-29T14:00:00',
    participants: [
      'Santiago Alarcon',
      'Aleska',
      'Carolina'
    ],
    offUser: null,
    note: null,
    className:"event-morning"
  },
  {
    id: 20,
    title: 'Turno Afternoon',
    start: '2024-09-29T14:00:00',
    end: '2024-09-29T22:00:00',
    participants: [
      'Edilson',
      'Ximena',
      'Alejandra Hernandez'
    ],
    offUser: null,
    note: null,
     className:"event-afternoon"
  },
  {
    id: 21,
    title: 'Turno Night',
    start: '2024-09-29T22:00:00',
    end: '2024-09-30T06:00:00',
    participants: [
      'Yusleidys',
      'Karen',
      'Carlos',
      'Alejandra Grajales'
    ],
    offUser: 'Santiago Suarez',
    note: 'Santiago Suarez descansa este turno',
    className:"event-night"
  }
];


const initialEmployees = [
  { id: 1, name: 'Edilson' },
  { id: 2, name: 'Ximena' },
  { id: 3, name: 'Alejandra Hernandez' },
  { id: 4, name: 'Santiago Alarcon' },
  { id: 5, name: 'Aleska' },
  { id: 6, name: 'Carolina' },
];


const CalendarPage = () => {
 
  const [employees] = useState(initialEmployees);
  const [events, setEvents] = useState(schedule);

useEffect(() => {
  
}, [events])

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
    const updatedEvents = events.map(event =>
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
      setEvents(events.filter(event => event.id !== clickInfo.event.id)); // Para eliminar eventos
      clickInfo.event.remove();
    }
  };

  return (
    <div> <div>
    <h2 className='text-3xl font-semibold mb-2 m-auto flex justify-center text-[#a47f11]'>Calendario de Horarios de Empleados</h2>
  <div className='mx-4 my-2'>
    
  <FullCalendar
  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
  initialView="timeGridWeek"
  headerToolbar={{
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay',
  }}
 
  events={events}
  eventContent={(eventInfo) => {
    // Accediendo a las propiedades adicionales
    const { participants, offUser } = eventInfo.event.extendedProps;
    
    return (
      <div className="p-2">
        <div className='text-gray-800 '><b>{eventInfo.timeText}</b></div>
        <div className='text-gray-700 font-bold'>{eventInfo.event.title}</div>
        <div style={{ fontSize: '0.8em', color: 'black' }}>Participantes: {participants}</div>
        {offUser && <div style={{ fontSize: '0.7em', color: 'black' }}><b>{offUser} OFF (Descanso)</b></div>}
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