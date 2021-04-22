import React, { useEffect, useState } from "react";
import { USER_SERVER } from "../../Config";
import axios from "axios";
import DisplayProfile from "../../DisplayProfile";
import { message } from "antd";

const LikedProfiles = () => {
  const [likedprofiles, setLikedProfiles] = useState([]);
  useEffect(() => {
    const id = localStorage.getItem("userId");
    const getLikedProfiles = async () => {
      await axios
        .get(`${USER_SERVER}/useraction?userId=${id}`)
        .then((res) => {
          setLikedProfiles(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    getLikedProfiles();
  }, []);

  const sendId = async (user, act) => {
    const senderId = localStorage.getItem("userId");
    var recieverId = user.likedFor;
    var data = { recieverId, senderId, action: act };
    await axios
      .post(`${USER_SERVER}/useraction/`, data)
      .then((res) => {
        message.success("Added to Favourites");
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="containers">
      <div
        style={{
          textAlign: "center",
          marginTop: "15px",
          display: "flex",
          justifyContent: "center",
          width: "100% ",
        }}
      >
        <h1> Your Favourite Profiles </h1>
      </div>
      {likedprofiles.map((user) => {
        return (
          <div className="profile-containers">
            <DisplayProfile
              likedProfile={true}
              user={user.likedFor}
              sendId={(user, action) => sendId(user, action)}
            />
          </div>
        );
      })}
    </div>
  );
};

export default LikedProfiles;
