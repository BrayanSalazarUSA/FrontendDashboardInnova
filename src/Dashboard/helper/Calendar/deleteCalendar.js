import Swal from "sweetalert2";

export const deleteCalendar = async (shiftId) => {
 
let resp = {}

    try {
      resp = await fetch(process.env.REACT_APP_SERVER_IP + "/schedule/"+shiftId, {
        method: "DELETE",
        "Content-Type": "application/json",
      });
 
  
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "The shift has been successfully deleted",
      });
  
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error,
      });
  
      console.log(error);
    }
  
    if (resp.status == 404) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error deleting the shift in database",
      });
      return;
    }
    return {};
  };
