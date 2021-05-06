import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { CHAT_SERVER, USER_SERVER } from "../../../components/Config";
import DisplayProfile from "../../DisplayProfile";
import { message } from "antd";
import io from "socket.io-client";
import { useHistory } from "react-router";

const Mutual = () => {
  const history = useHistory();
  const [mutualProfiles, setMutualProfiles] = useState([]);

  var id = localStorage.getItem("userId");

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

  //get msg from db
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

  // get mutually liked profiles from db
  const getMutualProfiles = async () => {
    var id = localStorage.getItem("userId");
    await axios
      .get(`${USER_SERVER}/mutualprofile?userId=${id}`)
      .then((res) => {
        setMutualProfiles(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // remove mutual liked profile
  const removeProfile = async (user, mutual) => {
    const id = localStorage.getItem("userId");
    await axios
      .delete(`${USER_SERVER}/useraction?userId=${id}&deletedId=${user?._id}`)
      .then((res) => {
        console.log(res.data);
        message.success("Profile removed");
      })
      .catch((err) => {
        console.log(err);
      });
    if (mutual !== undefined)
      await axios
        .delete(`${USER_SERVER}/mutualprofile?mutualProfileId=${mutual._id}`)
        .then((res) => {
          console.log(res.data);
          history.push("/home");
        })
        .catch((err) => {
          console.log(err);
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
                user={
                  id === mutual.user1?._id
                    ? mutual.user2
                    : id === mutual.user2?._id
                    ? mutual.user1
                    : null
                }
                mutual={mutual}
                likedProfile={true}
                removeProfile={(user, mutual) => removeProfile(user, mutual)}
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
