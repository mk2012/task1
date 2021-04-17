import * as React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Avatar } from "antd";
import { UserOutlined, LikeOutlined, DislikeOutlined } from "@ant-design/icons";
import { USER_SERVER } from "../../../components/Config";

let userData = [];
const Home = () => {
  const [name, setName] = useState("");
  useEffect(() => {
    const id = localStorage.getItem("userId");
    async function getName() {
      let response = await axios.get(`${USER_SERVER}/myprofile/${id}`);
      response = await response.data.oname;
      setName(response);
    }
    async function getUsers() {
      await axios.get(`${USER_SERVER}/users`).then((res) => {
        console.log(res.data.name);
        userData = res.data;
      });
    }
    getName();
    getUsers();
  }, []);
  return (
    <div>
      <div style={{ textAlign: "center" }}>
        <h1> Welcome {name} </h1>
      </div>
      <div className="home-container">
        {userData.map((user) => {
          if (name !== user.name)
            return (
              <div className="home-profile-container" key={user._id}>
                <Avatar size={64} icon={<UserOutlined />} />
                <h1>{user.name} </h1> <h4> {user.description}</h4>
                <div className="icon-container">
                  <LikeOutlined
                    className="like-btn"
                    style={{ fontSize: "30px" }}
                  />
                  <DislikeOutlined style={{ fontSize: "30px" }} />
                </div>
              </div>
            );
        })}
      </div>
    </div>
  );
};

export default Home;
