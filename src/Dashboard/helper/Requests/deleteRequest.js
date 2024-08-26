import Swal from "sweetalert2";

export const deleteRequest = async (requestId) => {
 
let resp = {}

    try {
      resp = await fetch(process.env.REACT_APP_SERVER_IP + "/requests/delete/"+requestId, {
        method: "DELETE",
        "Content-Type": "application/json",
      });
 
  
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "The request has been successfully deleted",
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
        text: "Error deleting request in database",
      });
      return;
    }
    return {};
  };
