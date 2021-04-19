import * as React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Avatar, Button, message } from "antd";
import { UserOutlined, LikeOutlined, DislikeOutlined } from "@ant-design/icons";
import { USER_SERVER } from "../../../components/Config";
import DisplayProfile from "../../DisplayProfile";

let userData = [];
let act = "";

const Home = () => {
  const [name, setName] = useState("");

  useEffect(() => {
    const id = localStorage.getItem("userId");
    const getUsers = async () => {
      await axios.get(`${USER_SERVER}/users?userId=${id}`).then((res) => {
        userData = res.data;
      });
    };
    const getName = async () => {
      let response = await axios.get(`${USER_SERVER}/myprofile/${id}`);
      response = await response.data.oname;
      setName(response);
    };

    getUsers();
    getName();
  }, []);

  const sendId = async (user, act) => {
    const senderId = localStorage.getItem("userId");
    var recieverId = user._id;
    var data = { recieverId, senderId, action: act };
    await axios
      .post(`${USER_SERVER}/useraction/`, data)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err.response.data.err);
        message.error(err.response.data.err);
      });
  };

  return (
    <div>
      <div style={{ textAlign: "center", marginTop: "10px" }}>
        <h1> Welcome {name} </h1>
      </div>
      <div className="home-container">
        {userData.map((user) => {
          if (name !== user.name)
            return (
              <DisplayProfile
                user={user}
                sendId={(user, action) => sendId(user, action)}
              />
            );
        })}
      </div>
    </div>
  );
};

export default Home;
