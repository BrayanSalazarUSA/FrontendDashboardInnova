import Swal from "sweetalert2";

export const getUser = async (user) => {
  let resp = {};
  const url = process.env.REACT_APP_SERVER_IP + "/users/login";
  let data = {};

  try {
    resp = await fetch(url, {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json",
      },
    });
    data = await resp.json(); 
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.toString(),
    });
    return; 
  }

  if (resp.status === 404 || resp.status === 401) {
    Swal.fire({
      icon: 'error',
      title: 'Credentials error',
      text: 'Please verify that your username and password are correct and try again.',
    });
    return; 
  } else if (resp.status === 200) {
    console.log("UserLoginDTO received:", data);

  }

  return data; 
};
