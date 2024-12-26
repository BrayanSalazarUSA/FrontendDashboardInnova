import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Divider,
} from "@mui/material";
import { LocalPoliceSharp } from "@mui/icons-material";

const PoliceValidationModal = ({ reportDetails }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    boxShadow: 24,
    borderRadius: 2,
    p: 4,
    maxWidth: "600px",
    width: "90%",
    
  };

  const isRejected = reportDetails?.policeValidation?.state === "REJECTED";

  return (
    <>
      
      <Button
        variant="contained"
        color={isRejected ? "error" : "success"}
        onClick={handleOpen}
        sx={{marginLeft:"15px"}}>
        Ver Validación Policial
      </Button>

      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Typography variant="h5" gutterBottom>
            Detalles de Validación Policial
          </Typography>
          <Divider sx={{ my: 2 }} />

          <Typography variant="body1" gutterBottom>
            <strong>Estado:</strong>{" "}
            <span
              style={{
                color: isRejected ? "red" : "green",
                fontWeight: "bold",
              }}
            >
              {reportDetails.policeValidation.state}
            </span>
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Revisado por:</strong> {reportDetails.policeValidation.validatedBy.name || "N/A"}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Nota:</strong> {reportDetails.policeValidation.note || "N/A"}
          </Typography>
          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>
            Campos Faltantes
          </Typography>
          <ul style={{ paddingLeft: "20px" }}>
            {!reportDetails.policeValidation.relatedToResidence && (
              <li>No relacionado con una residencia.</li>
            )}
            {!reportDetails.policeValidation.subjectLeftProperty && (
              <li>No se confirmó si el sujeto salió de la propiedad.</li>
            )}
            {!reportDetails.policeValidation.detailedDescription && (
              <li>No se incluyó una descripción detallada del sujeto.</li>
            )}
            {!reportDetails.policeValidation.subjectPlate && (
              <li>No se incluyó información sobre la placa del sujeto.</li>
            )}
            {!reportDetails.policeValidation.attachedPhoto && (
              <li>No se adjuntó una foto clara del sujeto.</li>
            )}
          </ul>
          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>
            Visto Por
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Nombre</strong></TableCell>
                <TableCell><strong>Fecha</strong></TableCell>
                <TableCell><strong>Hora</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reportDetails.policeValidation.viewReportRejected.map(
                ({ id, userEntity, viewedAt }) => {
                  const viewedDate = new Date(viewedAt);
                  const date = viewedDate.toLocaleDateString();
                  const time = viewedDate.toLocaleTimeString();

                  return (
                    <TableRow key={id}>
                      <TableCell>{userEntity.name}</TableCell>
                      <TableCell>{date}</TableCell>
                      <TableCell>{time}</TableCell>
                    </TableRow>
                  );
                }
              )}
            </TableBody>
          </Table>
          <Divider sx={{ my: 2 }} />

          <Button
            variant="outlined"
            color="secondary"
            onClick={handleClose}
            fullWidth
          >
            Cerrar
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default PoliceValidationModal;
