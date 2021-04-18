import * as React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Avatar, Button } from "antd";
import { UserOutlined, LikeOutlined, DislikeOutlined } from "@ant-design/icons";
import { USER_SERVER } from "../../../components/Config";

let userData = [];

const Home = () => {
  const [name, setName] = useState("");

  const id = localStorage.getItem("userId");
  useEffect(() => {
    const id = localStorage.getItem("userId");
    const getName = async () => {
      let response = await axios.get(`${USER_SERVER}/myprofile/${id}`);
      response = await response.data.oname;
      setName(response);
    };
    const getUsers = async () => {
      await axios.get(`${USER_SERVER}/users`).then((res) => {
        userData = res.data;
      });
    };

    getUsers();
    getName();
  }, []);
  // var profileId = [];

  // const sendId = async (user) => {
  //   profileId = user._id;
  //   console.log(profileId);
  //   await axios
  //     .post(`${USER_SERVER}/myprofile/${id}`, profileId)
  //     .then((res) => {
  //       console.log(res.data);
  //     });
  // }
  return (
    <div>
      <div style={{ textAlign: "center", marginTop: "10px" }}>
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
                  <Button
                  // onClick={() => {
                  //   sendId(user);
                  // }}
                  >
                    <LikeOutlined
                      className="like-btn"
                      style={{ fontSize: "30px" }}
                    />
                  </Button>
                  <Button>
                    <DislikeOutlined style={{ fontSize: "30px" }} />
                  </Button>
                </div>
              </div>
            );
        })}
      </div>
    </div>
  );
};

export default Home;
