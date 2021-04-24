import * as React from "react";
import { USER_SERVER } from "./Config";
import axios from "axios";
import { Avatar, Button, message } from "antd";
import { UserOutlined } from "@ant-design/icons";

const id = localStorage.getItem("userId");
const DisplayProfile = ({ user, sendId, likedProfile, mutualLiked }) => {
  const removeProfile = async (user) => {
    await axios
      .delete(`${USER_SERVER}/useraction?userId=${id}&deletedId=${user?._id}`)
      .then((res) => {
        console.log(res.data);
        message.info("Profile removed");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="home-profile-container" key={user?._id}>
      <Avatar size={64} icon={<UserOutlined />} />
      <h1>{user?.name} </h1> <h4> {user?.description}</h4>
      <div className="icon-container">
        {!likedProfile ? (
          <>
            <Button
              style={{
                backgroundColor: "#399B16",
                color: "white",
                width: "80px",
              }}
              onClick={() => {
                sendId(user, "liked");
              }}
            >
              Like
            </Button>
            <Button
              style={{
                backgroundColor: "#EA0A19",
                color: "white",
                width: "80px",
              }}
              onClick={() => {
                sendId(user, "disliked");
              }}
            >
              Dislike
            </Button>
          </>
        ) : (
          <Button
            onClick={() => {
              removeProfile(user);
            }}
            style={{ backgroundColor: "#191970", color: "white" }}
          >
            Remove
          </Button>
        )}
        {mutualLiked ? (
          <Button style={{ backgroundColor: "#FE0267", color: "white" }}>
            Message
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export default DisplayProfile;
