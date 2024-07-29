import { useContext } from "react";
import Swal from "sweetalert2";

export const updateRequestStatus = async (requestId, newStatus) => {
  const url = `${process.env.REACT_APP_SERVER_IP}/requests/updateStatus/${requestId}?newStatus=${newStatus}`;

  try {
    const response = await fetch(url, {
      method: "POST",
    });
    const data = await response.json();
    if (response.ok) {
      console.log(data);
      return data;
    } else {
      throw new Error(
        data.message
      );
    }
  } catch (error) {
    return null;
  }
};
