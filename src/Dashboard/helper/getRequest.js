import Swal from "sweetalert2";

export const getRequests = async () => {
  let resp = {};
  const url = process.env.REACT_APP_SERVER_IP + "/requests";
  let data = {};

  try {
    resp = await fetch(url);
    data = await resp.json(); 
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.toString(),
    });
    return; 
  }

 /*  if (resp.status === 404 || resp.status === 401) {
    Swal.fire({
      icon: 'error',
      title: 'Credentials error',
      text: 'Please verify that your username and password are correct and try again.',
    });
    return; 
  } else if (resp.status === 200) {
    console.log("UserLoginDTO received:", data);

  } */

  return data; 
};
