import * as React from "react";
import { USER_SERVER } from "./Config";
import axios from "axios";
import { Avatar, Button, message } from "antd";
import { UserOutlined, LikeOutlined, DislikeOutlined } from "@ant-design/icons";

const id = localStorage.getItem("userId");
const DisplayProfile = ({ user, sendId, likedProfile }) => {
  const removeProfile = async (user) => {
    await axios
      .delete(`${USER_SERVER}/useraction?userId=${id}&deletedId=${user._id}`)
      .then((res) => {
        console.log(res.data);
        message.info("Profile removed");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="home-profile-container" key={user._id}>
      <Avatar size={64} icon={<UserOutlined />} />
      <h1>{user.name} </h1> <h4> {user.description}</h4>
      <div className="icon-container">
        {!likedProfile ? (
          <>
            <Button
              onClick={() => {
                sendId(user, "liked");
              }}
            >
              <LikeOutlined className="like-btn" style={{ fontSize: "30px" }} />
            </Button>
            <Button
              onClick={() => {
                sendId(user, "disliked");
              }}
            >
              <DislikeOutlined style={{ fontSize: "30px" }} />
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
      </div>
    </div>
  );
};

export default DisplayProfile;
