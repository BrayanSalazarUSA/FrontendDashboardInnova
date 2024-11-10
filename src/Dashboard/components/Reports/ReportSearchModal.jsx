import React, { useState, useEffect } from "react";
import { Modal, Box, Button, MenuItem, TextField, Grid } from "@mui/material";
import axios from "axios";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { getUsersDTO } from "../../helper/getUsersDTO";
import { getPropertiesInfo } from "../../helper/getProperties";
import { getIncidents } from "../../helper/Incidents/getIncidents";

export const ReportSearchModal = ({
  isModalOpen,
  onClose,
  handleClear,
  setReports,
  handleModalClose,
  users,
  properties,
  caseTypes
}) => {
  const [propertyId, setPropertyId] = useState("");
  const [userId, setUserId] = useState("");
  const [caseTypeId, setCaseTypeId] = useState("");
  const [level, setLevel] = useState("");
  const [date, setDate] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);


  // Función para realizar la búsqueda
  const handleSearch = async () => {
    handleClear();

    const params = {
      userId: userId || undefined,
      caseTypeId: caseTypeId || undefined,
      date: date ? date.toISOString().split("T")[0] : undefined,
      startDate: startDate ? startDate.toISOString().split("T")[0] : undefined,
      endDate: endDate ? endDate.toISOString().split("T")[0] : undefined,
      propertyId: propertyId || undefined,
    };
    // Filtrar parámetros no definidos para evitar "undefined" en la URL
    const queryParams = new URLSearchParams(
      Object.entries(params).filter(([, value]) => value !== undefined)
    );

    // Construir la URL con los parámetros de consulta
    const url = `${process.env.REACT_APP_SERVER_IP}/reports/search?${queryParams}`;

    console.log(url); // Ver la URL generada
    // Realizar la solicitud fetch
    const response = await fetch(url, {
      method: "GET", // O 'POST' si es necesario
      headers: {
        "Content-Type": "application/json",
        // Otros headers si los necesitas
      },
    });

    let data = await response.json();
    console.log(data);
    setReports(data);
    handleModalClose()
  };

  return (
    <Modal
      open={true}
      onClose={onClose}
      className="overflow-y-scroll"
      aria-labelledby="modal-menu-title"
      aria-describedby="modal-menu-description"
    >
      <Box
        sx={{
          bgcolor: "background.paper",
          p: 4,
          width: 500,
          mx: "auto",
          my: "10%",
        }}
      >
        <h2>Búsqueda de Reportes</h2>
        <Grid container spacing={2}>
          {/* Dropdown para seleccionar Propiedad */}
          <Grid item xs={6}>
            <TextField
              select
              fullWidth
              label="Propiedad"
              value={propertyId}
              onChange={(e) => setPropertyId(e.target.value)}
            >
              {properties.map((property) => (
                <MenuItem key={property.id} value={property.id}>
                  {property.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Dropdown para seleccionar Agente */}
          <Grid item xs={6}>
            <TextField
              select
              fullWidth
              label="Agente"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            >
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Dropdown para seleccionar Tipo de Caso */}
          <Grid item xs={6}>
            <TextField
              select
              fullWidth
              label="Tipo de Caso"
              value={caseTypeId}
              onChange={(e) => setCaseTypeId(e.target.value)}
            >
              {caseTypes.map((caseType) => (
                <MenuItem key={caseType.id} value={caseType.id}>
                  {caseType.incident}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Date Picker para Fecha */}
          <Grid item xs={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Fecha"
                value={date}
                onChange={(newDate) => setDate(newDate)}
                renderInput={(params) => <TextField fullWidth {...params} />}
              />
            </LocalizationProvider>
          </Grid>

          {/* Date Pickers para Rango de Fechas */}
          <Grid item xs={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Fecha Inicio"
                value={startDate}
                onChange={(newDate) => setStartDate(newDate)}
                renderInput={(params) => <TextField fullWidth {...params} />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Fecha Fin"
                value={endDate}
                onChange={(newDate) => setEndDate(newDate)}
                renderInput={(params) => <TextField fullWidth {...params} />}
              />
            </LocalizationProvider>
          </Grid>

          {/* Botón para realizar búsqueda */}
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleSearch}
            >
              Buscar
            </Button>
          </Grid>
        </Grid>

        {/* Renderizar los resultados de los reportes */}
      </Box>
    </Modal>
  );
};
