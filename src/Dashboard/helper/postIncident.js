import { CameraAltTwoTone } from "@mui/icons-material";
import React, { useContext } from "react";
import Swal from "sweetalert2";
import { UserContext } from "../../context/UserContext";

export const postIncident = async (caseProvider, setreportSaved, reportSaved, t) => {


  let resp = {};

  const url = `${process.env.REACT_APP_SERVER_IP}/cases`;
  let data = {};
  try {
    resp = await fetch(url, {
      method: "POST",
      body: JSON.stringify(caseProvider),
      headers: {
        "Content-Type": "application/json",
      },
    });
    data = await resp.json();
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: t('dashboard.cases.swal.added-case'),
      showConfirmButton: false,
      timer: 3000
    });
    setreportSaved(!reportSaved)
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error,
    });
  }

  if (resp.status == 500) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Error saving the incident, check that all fields are filled in and try again.",
    });
    return;
  }

  console.log(data);
  return data;
};
