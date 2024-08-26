import React, { useRef, useState } from 'react'

const ReportChat = () => {


    const userSession = JSON.parse(localStorage.getItem("user"));
    const [stompClient, setStompClient] = useState(null);
    const [messages, setMessages] = useState([]);

    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef(null);

  return (
    <div>ReportChat</div>
  )
}


const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "700px",
    backgroundColor: "white",
    padding: "16px 12px 24px",
    boxShadow: "0 3px 6px rgba(0, 0, 0, 0.16)",
  };
  
  const style = {
    bgcolor: "background.paper",
    width: "100%",
    boxShadow: 24,
    p: 4,
    borderRadius: 3,
  };


export default ReportChat