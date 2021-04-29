import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { Button, Input, message } from "antd";
import axios from "axios";
import { USER_SERVER } from "../../Config";
import { CHAT_SERVER } from "../../Config";
import { connect } from "react-redux";
import { useLocation } from "react-router";
const ChatPage = () => {
  const [chat, setChat] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const location = useLocation();
  const [roomId, setRoomId] = useState();
  const [messages, setMessages] = useState([]);
  // const [api, contextHolder] = notification.useNotification();
  // const openNotification = (message) => {
  //   api.info({
  //     message: `New Message`,
  //     description: message,
  //     placement: "topRight",
  //   });
  // };
  // const [chats, setChats] = useState([]);
  useEffect(() => {
    getCurrentUserInfo();
  }, []);
  const id = localStorage.getItem("userId");

  useEffect(() => {
    var socket = io("http://localhost:8002", {
      transports: ["websocket", "polling", "flashsocket"],
    });
    socket.on("messageSent", (messages) => {
      setMessages(messages);
    });
  }, []);

  useEffect(() => {
    let roomId = location.state.roomId;
    console.log(roomId);
    setRoomId(roomId);

    axios.get(`${CHAT_SERVER}/?roomId=${roomId}`).then((res) => {
      setMessages(res.data);
    });
  }, []);

  const getCurrentUserInfo = async () => {
    const id = localStorage.getItem("userId");
    await axios
      .get(`${USER_SERVER}/users/${id}`)
      .then((res) => {
        setName(res.data.name);
        setImage(res.data.image);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSubmit = () => {
    const id = localStorage.getItem("userId");
    var socket = io("http://localhost:8002", {
      transports: ["websocket", "polling", "flashsocket"],
    });
    socket.emit("message", { userId: id, message: chat, roomId: roomId });

    setChat("");
  };

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    return messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="chatpage-container">
      <h1> Chats </h1>
      <div className="chat-container">
        {messages.map((m) => {
          return (
            <div
              style={{
                display: "flex",
                justifyContent:
                  m.userId?._id === id ? "flex-start" : "flex-end",
                marginTop: 5,
              }}
            >
              {m.userId?._id === id && (
                <img
                  src={m.userId?.image}
                  style={{
                    width: 30,
                    height: 30,
                    objectFit: "cover",
                    borderRadius: 50,
                    margin: 5,
                  }}
                />
              )}
              <span
                style={{
                  color: m.userId?._id === id ? "green" : "red",
                  backgroundColor: "#FFF",
                  borderRadius: 25,
                  borderTopLeftRadius: m.userId?._id === id ? 0 : 25,
                  borderTopRightRadius: m.userId?._id === id ? 25 : 0,
                  padding: 10,
                  maxWidth: "60%",
                  overflowWrap: "break-word",
                }}
              >
                {m.message}
              </span>
              {m.userId?._id !== id && (
                <img
                  src={m.userId?.image}
                  style={{
                    width: 30,
                    height: 30,
                    objectFit: "cover",
                    borderRadius: 50,
                    margin: 5,
                  }}
                />
              )}
              <div ref={messagesEndRef} />
            </div>
          );
        })}
        :
      </div>
      <Input
        style={{ width: "30%", marginTop: 10 }}
        placeholder="Enter your message here..."
        onChange={(e) => setChat(e.target.value)}
        value={chat}
      />

      <Button
        style={{ width: "30%", marginTop: 10 }}
        type="primary"
        onClick={handleSubmit}
      >
        send
      </Button>
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    chat: state.chats,
  };
};
export default connect(mapStateToProps)(ChatPage);
