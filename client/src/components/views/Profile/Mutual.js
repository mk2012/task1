import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { CHAT_SERVER, USER_SERVER } from "../../../components/Config";
import DisplayProfile from "../../DisplayProfile";
import io from "socket.io-client";
import { useHistory } from "react-router";

const Mutual = () => {
  const history = useHistory();
  const [mutualProfiles, setMutualProfiles] = useState([]);
  const [user, setUser] = useState([]);

  useEffect(() => {
    getMutualProfiles();
  }, []);

  useEffect(() => {
    var socket = io("http://localhost:8002", {
      transports: ["websocket", "polling", "flashsocket"],
    });
    socket.on("joined", (roomId) => {
      console.log(roomId);
      history.push("/chats", { roomId: roomId });
    });
  }, []);

  const handleClickMessage = (receiverId, mutualId) => {
    const id = localStorage.getItem("userId");
    var socket = io("http://localhost:8002", {
      transports: ["websocket", "polling", "flashsocket"],
    });
    axios.get(`${CHAT_SERVER}/mutual?mutualId=${mutualId}`).then((res) => {
      let mutualProfile = res.data;
      if (mutualProfile.roomId === undefined || mutualProfile.roomId === null)
        socket.emit("join", { senderId: id, receiverId, mutualId });
      else {
        history.push("/chats", { roomId: mutualProfile.roomId });
      }
    });

    // socket.on("Output chat message", (message) => {
    //   console.log(message);
    // });
  };

  const getMutualProfiles = async () => {
    var id = localStorage.getItem("userId");
    await axios
      .get(`${USER_SERVER}/mutualprofile?userId=${id}`)
      .then((res) => {
        setMutualProfiles(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getUser();
  }, [getMutualProfiles]);

  const getUser = () => {
    const id = localStorage.getItem("userId");

    mutualProfiles.map((mutual) => {
      if (id == mutual.user1) {
        setUser(mutual.user2);
      } else {
        setUser(mutual.user1);
      }
    });
  };
  return (
    <div>
      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <h1> Mutual Liked Profiles </h1>
      </div>
      <div className="home-container">
        {mutualProfiles.length !== 0 ? (
          mutualProfiles.map((mutual) => {
            return (
              <DisplayProfile
                key={mutual._id}
                user={user}
                likedProfile={true}
                mutualLiked={true}
                onClickMessage={(userId) =>
                  handleClickMessage(userId, mutual._id)
                }
              />
            );
          })
        ) : (
          <h2> No Mutually Liked profiles so far... </h2>
        )}
      </div>
    </div>
  );
};

export default Mutual;
