import Swal from "sweetalert2";

export const getUser = async (user) => {
  const url = process.env.REACT_APP_SERVER_IP + "/users/login";
  let data = {};

  try {
    const resp = await fetch(url, {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (resp.status === 401) {
      Swal.fire({
        icon: 'error',
        title: 'Credentials Error',
        text: 'Please verify that your email and password are correct and try again.',
            toast: true,
        position: 'top-end',
        showConfirmButton: false,
      });
      return null;
    }

   /*  if (resp.ok) {
    
      Swal.fire({
        icon: 'success',
        title: 'Welcom to IDS',
            toast: true,
        position: 'top-end',
        showConfirmButton: false,
      });
      return null;
    } */
    if (!resp.ok) {
    
      Swal.fire({
        icon: 'error',
        title: 'Server Error',
        text: 'An unexpected error occurred. Please try again later.',
            toast: true,
        position: 'top-end',
        showConfirmButton: false,
      });
      return null;
    }

    data = await resp.json();
    return data;

  } catch (error) {
   
    Swal.fire({
      icon: 'error',
      title: 'Connection Error',
    text: 'The service seems to be offline. Please check your network connection and try again.',
          toast: true,
      position: 'top-end',
      showConfirmButton: false,
    });
  }
};
