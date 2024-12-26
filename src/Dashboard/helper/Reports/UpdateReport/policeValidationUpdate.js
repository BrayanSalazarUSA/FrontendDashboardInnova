import Swal from "sweetalert2";

export const policeValidation = async (reportId, data) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_SERVER_IP}/reports/police-validation/${reportId}`,
      {
        method: "POST", // Siempre usa PUT para creación/actualización
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (response.ok) {
      const result = await response.json();
      console.log("Reporte validado correctamente", result);
    } else {
      const errorResponse = await response.text();
      console.error("Response error:", errorResponse);
      throw new Error("No fue posible validar el reporte");
    }
  } catch (error) {
    console.error("Error al validar reporte:", error);
    Swal.fire({
      icon: "error",
      title: "Error en el reporte",
      text: error.toString(),
    });
  }
};
