import React, { useContext, useEffect, useRef, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import "./style.css";
import Sidebar from "./components/Sidebar/Sidebar.jsx";
import { FooterDash, NavbarDash } from "./components";
import { UserContext } from "../context/UserContext";
import { useStateContext } from "../context/ContextProvider";
import useFetchProperty from "./Hooks/useFetchProperty";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Alert, Divider, IconButton, Stack } from "@mui/material";
import Stomp from "stompjs";
import { CheckCircle, Close, Error } from "@mui/icons-material";
import messageSound from '../assets/notification.mp3'
const Dashboard = () => {
  const { activeMenu } = useStateContext();
  const { propertyContext, setPropertyContext } = useContext(UserContext);
  const navigate = useNavigate();
  const loadInitialUser = () => {
    const userStored = localStorage.getItem("user");
    if (userStored) {
      return JSON.parse(userStored);
    }
    // Retorna un objeto inicial si no hay nada en localStorage
    return { id: null, viewed: false, role: { rolName: "" } };
  };

   const audioRef = useRef(null);
  const [user, setUser] = useState(loadInitialUser);
  const propertyStorage = JSON.parse(localStorage.getItem("propertySelected"));
  const propertyId = propertyStorage ? propertyStorage.id : 1;
  const { property } = useFetchProperty(propertyId, navigate);
  const [rejectedReports, setRejectedReports] = useState([]); // Guardamos los reportes rechazados
  const [currentReportIndex, setCurrentReportIndex] = useState(0); // Para saber qué reporte mostrar

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    textAlign: "center",
  };

  useEffect(() => {
    const socketUrl =
      process.env.REACT_APP_WEB_SOCKET_IP || "ws://localhost:8080/ws";
    const socket = new WebSocket(socketUrl);
    const stompClient = Stomp.over(socket);
    console.log("Conecting to web socket");
    stompClient.connect({}, () => {
      stompClient.subscribe(`/topic/validation/${user.id.toString()}`, (message) => {
        console.log("Subscriving  to web socket");
        const receivedMessage = JSON.parse(message.body);
        console.log("NEW MESSAGE");
        // Verificar si el estado recibido es REJECTED
        // Reiniciar `currentReportIndex` para comenzar con el nuevo reporte
        audioRef?.current?.play().catch((error) => {
          console.log("Error playing audio: ", error);
        });
       setRejectedReports([receivedMessage]); // Si quieres mostrar sólo la nueva notificación
       setCurrentReportIndex(0);
        setOpen(true); // Abrir el modal
      });
    });
  }, []);

  useEffect(() => {
    if (
      property &&
      Object.keys(propertyContext).length === 0 &&
      Object.keys(property).length > 0
    ) {
      setPropertyContext(property);
    }
    if (!propertyId) {
      navigate("/");
    }
  }, [property, propertyContext, setPropertyContext, navigate, propertyId]);

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "user" && !event.newValue) {
        navigate("/login");
      }
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [navigate]);

  // Lógica para obtener reportes rechazados desde la API
  useEffect(() => {
    const fetchRejectedReports = async () => {
      try {
        const userId = user?.id;
        if (!userId) return; // Si no hay un usuario, no hacemos la petición

        const response = await fetch(
          `${process.env.REACT_APP_SERVER_IP}/reports/new-rejected-reports/${userId}`
        );

        if (response.ok) {
          const data = await response.json();
         console.log('data')
         console.log(data)
          if (data.length > 0) {
            let reportsUserValidatedIds = data.filter( validation => {
              console.log(validation)
              console.log(userId)
              if(validation.validatedBy.id !== userId){
                return validation
              }else{
                return null
              }
            })
            if(reportsUserValidatedIds.length > 0){
              setRejectedReports(reportsUserValidatedIds);
              setOpen(true); // Abrir el modal si hay reportes rechazados
            }
            console.log('reportsUserValidatedIds')
            console.log(reportsUserValidatedIds)
           
          }
        } else {
          console.error("Error al obtener los reportes rechazados");
        }
      } catch (error) {
        console.error("Error en la petición:", error);
      }
    };

    if (
      user?.role?.rolName === "Admin" ||
      user?.role?.rolName === "Supervisor"
    ) {
      fetchRejectedReports();
    }
  }, [user]);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);

  // Función para manejar el cierre del modal
  const handleClose = async () => {
    console.log(rejectedReports)
    console.log(currentReportIndex)
    const reportId = rejectedReports[currentReportIndex]?.id;
    const userId = user.id;

    try {
      const serverIp = process.env.REACT_APP_SERVER_IP;
      const url = `${serverIp}/reports/mark-as-viewed/${reportId}/${userId}`;

      const response = await fetch(url, {
        method: "POST", // O el método que corresponda
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Error en la solicitud");
      }

      // Avanzamos al siguiente reporte
      console.log("currentReportIndex, rejectedReports.length");
      console.log(currentReportIndex, rejectedReports.length);
      if (currentReportIndex < rejectedReports.length - 1) {
        setCurrentReportIndex(currentReportIndex + 1); // Avanzar al siguiente reporte
      } else {
        setOpen(false); // Si ya no hay más reportes, cerramos el modal
      }
    } catch (error) {
      console.error("Error al hacer la petición:", error);
    }
  };
  const notification = rejectedReports[currentReportIndex];
  console.log("notification");
  console.log(notification);

  return (
    <div className="flex relative dark:bg-main-dark-bg w-screen">
        <audio ref={audioRef} preload="auto" className="hidden" controls>
              <source src={messageSound} type="audio/mpeg" />
              Tu navegador no soporta la reproducción de audio.
            </audio>
      {activeMenu ? (
        <div className="w-1/5 fixed sidebar dark:bg-secondary-dark-bg bg-white ">
          <Sidebar />
        </div>
      ) : (
        <div className="w-0 dark:bg-secondary-dark-bg">
          <Sidebar />
        </div>
      )}

      <div
        className={
          activeMenu
            ? "dark:bg-main-dark-bg  bg-main-bg min-h-screen md:ml-[20%] w-4/5"
            : "bg-main-bg dark:bg-main-dark-bg min-h-screen flex-2 w-full"
        }
      >
        <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg ">
          <NavbarDash />
        </div>
        {/* {themeSettings && (<ThemeSettings />)} */}
        <Outlet />

        {/* Modal de Reporte Rechazado */}

        <Modal
          open={open}
          onClose={null} // Prevent closing on click outside
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              ...style,
              width: 500,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 3,
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography
                id="modal-modal-title"
                variant="h5"
                fontWeight="bold"
                gutterBottom
              >
                Reporte Rechazado
              </Typography>
              <IconButton onClick={handleClose}>
                <Close />
              </IconButton>
            </Stack>
            <Divider sx={{ my: 2 }} />

            {open && (
        <>
          {rejectedReports.length > 0 ? (
            <>
              <Alert severity="error" icon={<Error />} sx={{ mb: 2 }}>
                Este reporte ha sido rechazado.
              </Alert>
              <Typography
                id="modal-modal-description"
                variant="body1"
                sx={{ mb: 2 }}
              >
                <strong>Reporte:</strong>{" "}
                {notification?.report?.numerCase || "N/A"}
                <br />
                <Typography variant="body1" gutterBottom>
                  <strong>Revisado por:</strong>{" "}
                  {notification?.validatedBy?.name || "N/A"}
                </Typography>
                <br />
                <strong>Razón del rechazo:</strong>{" "}
                {notification?.note || "No se especificó razón."}
              </Typography>{" "}
              *
              <ul style={{ paddingLeft: "20px" }}>
                {!notification?.relatedToResidence && (
                  <li>No relacionado con una residencia.</li>
                )}
                {!notification?.subjectLeftProperty && (
                  <li>No se confirmó si el sujeto salió de la propiedad.</li>
                )}
                {!notification?.detailedDescription && (
                  <li>No se incluyó una descripción detallada del sujeto.</li>
                )}
                {!notification?.subjectPlate && (
                  <li>
                    No se incluyó información sobre la placa del sujeto.
                  </li>
                )}
                {!notification?.attachedPhoto && (
                  <li>No se adjuntó una foto clara del sujeto.</li>
                )}
              </ul>
              <Divider sx={{ my: 2 }} />
            </>
          ) : (
            <Alert severity="info" icon={<CheckCircle />} sx={{ mb: 2 }}>
              No hay reportes rechazados en este momento.
            </Alert>
          )}
        </>
      )}
            <Divider sx={{ my: 2 }} />

            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleClose}
              sx={{
                fontWeight: "bold",
                py: 1.5,
              }}
            >
              Confirmar
            </Button>
          </Box>
        </Modal>
        <FooterDash />
      </div>
    </div>
  );
};

export default Dashboard;
