import * as React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { USER_SERVER } from "../../../components/Config";
import DisplayProfile from "../../DisplayProfile";

let act = "";

const Home = () => {
  const [name, setName] = useState("");
  const [userData, setUserData] = useState([]);

  const getUsers = async () => {
    const id = localStorage.getItem("userId");
    await axios.get(`${USER_SERVER}/users?userId=${id}`).then((res) => {
      setUserData(res.data);
    });
  };

  const getName = async () => {
    const id = localStorage.getItem("userId");
    let response = await axios.get(`${USER_SERVER}/myprofile/${id}`);
    response = await response.data.oname;
    setName(response);
  };

  useEffect(() => {
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
        getUsers();
      })
      .catch((err) => {
        console.log(err);
        // message.error(err.response.data.err);
      });
  };

  return (
    <div>
      <div style={{ textAlign: "center", marginTop: "10px" }}>
        <h1> Welcome {name} </h1>
      </div>
      <div className="home-container">
        {/* {userData.map((user) => {
          if (name !== user.name)
            return ( */}
        {userData.length !== 0 ? (
          <DisplayProfile
            user={userData[0]}
            sendId={(user, action) => sendId(user, action)}
          />
        ) : (
          <div>No Users Found</div>
        )}
        {/* );
        })} */}
      </div>
    </div>
  );
};

export default Home;
