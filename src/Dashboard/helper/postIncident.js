import Swal from "sweetalert2";

export const postIncident = async (caseProvider, setreportSaved, reportSaved, t) => {
  let resp = {};

  const url = `${process.env.REACT_APP_SERVER_IP}/cases`;
  try {
    resp = await fetch(url, {
      method: "POST",
      body: JSON.stringify(caseProvider),
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Comprueba si la respuesta es texto plano en lugar de JSON
    const isJson = resp.headers.get("content-type")?.includes("application/json");
    const data = isJson ? await resp.json() : await resp.text();

    if (resp.ok) {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: t('dashboard.cases.swal.added-case'),
        showConfirmButton: false,
        timer: 3000
      });
      setreportSaved(!reportSaved);
    } else {
      throw new Error(data);
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error.message || "An error occurred",
    });
  }

  if (resp.status === 500) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Error saving the incident, check that all fields are filled in and try again.",
    });
  }
};
