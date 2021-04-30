import * as React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { USER_SERVER } from "../../../components/Config";
import DisplayProfile from "../../DisplayProfile";
import io from "socket.io-client";

let act = "";

const Home = () => {
  const [name, setName] = useState("");
  const [userData, setUserData] = useState([]);
  const [dislikeduserData, setDisLikedUserData] = useState([]);

  const getUsers = async () => {
    const id = localStorage.getItem("userId");
    await axios.get(`${USER_SERVER}/users?userId=${id}`).then((res) => {
      setUserData(res.data);
      getDislikedUsers();
    });
  };

  const getName = async () => {
    const id = localStorage.getItem("userId");
    let response = await axios.get(`${USER_SERVER}/myprofile/${id}`);
    response = await response.data.oname;
    setName(response);
  };

  const getDislikedUsers = async () => {
    const id = localStorage.getItem("userId");
    await axios
      .get(`${USER_SERVER}/dislikedprofile?userId=${id}`)
      .then((res) => {
        if (res.data?.length !== 0) {
          setDisLikedUserData(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getUsers();
    getName();
    // getDislikedUsers();
  }, []);

  // Store like/dislike
  const sendId = async (user, act) => {
    const senderId = localStorage.getItem("userId");
    var recieverId = user._id;
    var data = { recieverId, senderId, action: act };
    if (act == "liked") {
      var socket = io("http://localhost:8003", {
        transports: ["websocket", "polling", "flashsocket"],
      });
      socket.emit("Notify", (user) => {
        // For Msg Notification
        console.log(user);
      });
    }
    await axios
      .post(`${USER_SERVER}/useraction/`, data)
      .then((res) => {
        console.log(res.data);
        getUsers();
        // getDislikedUsers();
      })
      .catch((err) => {
        console.log(err);
        // message.error(err.response.data.err);
      });
  };

  useEffect(() => {
    console.log(userData);
  }, [userData]);
  return (
    <div>
      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <h1 style={{ letterSpacing: "4px", color: "#4682B4" }}>
          Welcome {name}
        </h1>
        <h2>Suggested Profiles : </h2>
      </div>
      <div className="home-container">
        {userData.length !== 0 || dislikeduserData.length !== 0 ? (
          <DisplayProfile
            user={
              userData.length !== 0
                ? userData[0]
                : dislikeduserData.length !== 0
                ? dislikeduserData[0]
                : {}
            }
            sendId={(user, action) => sendId(user, action)}
          />
        ) : (
          // <div className="home-container">
          //   {dislikeduserData.length !== 0 ? (
          //     <DisplayProfile
          //       user={dislikeduserData[0]}
          //       sendId={(user, action) => sendId(user, action)}
          //     />
          //   ) : (
          <div>No Users Found</div>
          //   )}
          // </div>
        )}
      </div>
    </div>
  );
};

export default Home;
