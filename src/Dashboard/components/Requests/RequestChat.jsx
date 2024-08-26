import React, { useEffect, useRef, useState } from "react";

import { Box, IconButton, Typography } from "@material-ui/core";
import { InputText } from "primereact/inputtext";
import { useTranslation } from "react-i18next";
import { formatDate, formatTime } from "../../helper/postReport";
import { FaExchangeAlt } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import Stomp from "stompjs";

import messageSound from "../../../assets/message.mp3";

import { List } from "reactstrap";
import { Button } from "primereact/button";
import { TiArrowBack } from "react-icons/ti";
import { MdSportsGolf } from "react-icons/md";

const RequestChat = ({ selectedRequest, handleClose, setUpdates }) => {

  const userSession = JSON.parse(localStorage.getItem("user"));
  const [stompClient, setStompClient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [changes, setChanges] = useState([]);
  const [eventList, setEventList] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    setMessages(selectedRequest?.messages || []);
    setChanges(selectedRequest?.responsabilityChange || []);

    const combined = [];

    selectedRequest?.messages.forEach((msg) => {
      combined.push({
        type: "message",
       ...msg
      });
    });

    selectedRequest?.responsabilityChange.forEach((change) => {
      combined.push({
        type: "change",
        ...change
      });
    });

      function parseDate(dateStr) {
        const [datePart, timePart] = dateStr.split(' ');
        const [month, day, year] = datePart.split('-').map(Number);
        const [hours, minutes] = timePart.split(':').map(Number);
        return new Date(year, month - 1, day, hours, minutes);
    }
    
    // Sorting the array
    combined.sort((a, b) => {
        const dateA = parseDate(a.timestamp);
        const dateB = parseDate(b.timestamp);
        return dateA - dateB;
    });
      setEventList(combined);
  

  }, [selectedRequest]);

  useEffect(() => {
    const socketUrl =
      process.env.REACT_APP_WEB_SOCKET_IP || "ws://localhost:8080/ws";
    const socket = new WebSocket(socketUrl);
    const client = Stomp.over(socket);

    client.connect({}, () => {
      client.subscribe(`/topic/requests/${selectedRequest.id}`, (message) => {
        const receivedMessage = JSON.parse(message.body);
        setEventList((prevMessages) => [
          ...prevMessages,
          {
            type: "message",
            content: receivedMessage.content,
            sender: receivedMessage.sender,
            timestamp: new Date(receivedMessage.timestamp),
          },
        ]);
        console.log("Nuevo Mensaje");
        console.log(receivedMessage);
        console.log(eventList);
        if (
          audioRef.current &&
          receivedMessage?.sender?.name !== userSession?.name
        ) {
          audioRef.current.play().catch((error) => {
            console.log("Error playing audio: ", error);
          });
        }
      });
    });

    setStompClient(client);
  }, [selectedRequest.id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [eventList,selectedRequest.id]);

  const handleSendMessage = () => {
    if (newMessage.trim() && stompClient) {
      const message = {
        sender: userSession,
        content: newMessage,
        timestamp: formatDate(new Date()) + " " + formatTime(new Date()),
      };
      stompClient.send(
        `/app/requests/${selectedRequest.id}/send`,
        {},
        JSON.stringify(message)
      );
      setNewMessage("");
    }
  };

  const renderEvent = (event) => {



    if (event.type === "message") {
      return (
        <Box
          key={event.id}
          mb={2}
          display="flex"
          justifyContent={
            event.sender?.name === userSession.name
              ? "flex-end"
              : "flex-start"
          }
        >
          <Box maxWidth="100%" borderRadius={4}>
            <div className="flex items-start gap-2.5 px-5">
              <img
                className="w-8 h-8 rounded-full"
                src={`${process.env.REACT_APP_S3_BUCKET_URL}/${event.sender?.image}`}
                alt="User"
              />
              <div className="flex flex-col gap-1 w-full max-w-[320px]">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {event.sender?.name}
                  </span>
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div
                  className={`flex flex-col leading-1.5 p-4 border-gray-200 rounded-e-xl rounded-es-xl ${
                    event.sender?.name === userSession.name
                      ? "bg-[#ab7916] text-gray-200"
                      : "bg-gray-900 text-gray-200"
                  }`}
                >
                  <p className="text-sm font-normal dark:text-white">
                    {event.content || "Mensaje de ejemplo"}
                  </p>
                </div>
              </div>
            </div>
          </Box>
        </Box>
      );
    } else if (event.type === "change") {
      return (
        <Box
          key={event.timestamp}
          className="mx-auto flex flex-col justify-center items-center my-5"
        >
          <span className="text-sm font-semibold text-gray-900">
            {event.previousResponsible.name} se encargará de esto!
          </span>
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
            {new Date(event.timestamp).toLocaleTimeString()}
          </span>
          <Box className="flex mx-auto">
            <img
              className="w-12 h-12 rounded-full"
              src={`${process.env.REACT_APP_S3_BUCKET_URL}/${event.previousResponsible.image}`}
              alt="Previous Responsible"
            />
            <FaExchangeAlt className="text-2xl text-green-600" />
            <img
              className="w-12 h-12 rounded-full"
              src={`${process.env.REACT_APP_S3_BUCKET_URL}/${event.newResponsible.image}`}
              alt="New Responsible"
            />
          </Box>
        </Box>
      );
    }
    return null;
  };

  return (
    <Box sx={modalStyle}>
      <audio ref={audioRef} preload="auto" className="hidden" controls>
        <source src={messageSound} type="audio/mpeg" />
        Tu navegador no soporta la reproducción de audio.
      </audio>

      <Box sx={style}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6">Chat Request {selectedRequest.id}</Typography>
          <IconButton onClick={handleClose}></IconButton>
          <TiArrowBack
            style={{
              color: "#ab7916",
              fontSize: "40px",
              fontWeight: "600",
              cursor: "pointer",
              filter: "drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.2))",
            }}
            onClick={() => setUpdates((prev) => !prev)}
          />
        </Box>

        <Box height={400} overflow="auto">
          <List>
            {eventList.map((event) => renderEvent(event))}
            <div ref={messagesEndRef} />
          </List>
        </Box>

        <Box display="flex" mt={2}>
          <InputText
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escribe un mensaje..."
            style={{ flexGrow: 1, marginRight: "8px" }}
          />
          <Button
            label="Enviar"
            style={{ backgroundColor: "#ab7916" }}
            onClick={handleSendMessage}
          />
        </Box>
      </Box>
    </Box>
  );
};

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

export default RequestChat;
