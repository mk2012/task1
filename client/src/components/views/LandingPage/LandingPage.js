import React, { useEffect, useState } from "react";
import axios from "axios";
import { USER_SERVER } from "../../Config";
import { Avatar, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";

function LandingPage() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    getUsers();
  });

  const getUsers = async () => {
    await axios.get(`${USER_SERVER}/users`).then((res) => {
      setUsers(res.data);
    });
  };
  return (
    <div>
      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <h1> Welcome </h1>
        <h2> Register to Like/Reject the profiles </h2>
      </div>
      <div className="home-container">
        <div className="home-profile-container">
          <Avatar size={64} icon={<UserOutlined />} src={users[0]?.image} />
          <h1>{users[0]?.name} </h1> <h4> {users[0]?.description}</h4>
          <div
            style={{
              display: "flex",
              width: "20%",
              justifyContent: "space-between",
            }}
          >
            <Button
              style={{
                backgroundColor: "#399B16",
                color: "white",
                width: "120px",
              }}
              type="primary"
              disabled
            >
              Like
            </Button>
            <Button
              style={{
                backgroundColor: "#EA0A19",
                color: "white",
                width: "80px",
              }}
              type="primary"
              disabled
            >
              Dislike
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
