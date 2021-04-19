import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { USER_SERVER } from "../components/Config";
import { Avatar, Button } from "antd";
import { UserOutlined, LikeOutlined, DislikeOutlined } from "@ant-design/icons";

const id = localStorage.getItem("userId");
const DisplayProfile = ({ user, sendId }) => {
  // const [profiledata, setProfileData] = useState([]);

  // const getData = async (d) => {
  //   let id = d.likedFor;
  //   await axios.get(`${USER_SERVER}/users/${id}`).then((res) => {
  //     setProfileData(...profiledata, res.data);
  //   });
  // };

  return (
    <div className="home-profile-container" key={user._id}>
      <Avatar size={64} icon={<UserOutlined />} />
      <h1>{user.name} </h1> <h4> {user.description}</h4>
      <div className="icon-container">
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
      </div>
    </div>
  );
};

export default DisplayProfile;
