import React, { useEffect, useState } from "react";
import axios from "axios";
import { USER_SERVER } from "../../Config";

const UserNotifications = () => {
  const [userNotifications, setUserNotifications] = useState([]);

  useEffect(() => {
    getNotifications();
  }, []);

  const getNotifications = async () => {
    const id = localStorage.getItem("userId");
    await axios
      .get(`${USER_SERVER}/notifications?senderId=${id}`)
      .then((res) => {
        setUserNotifications(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      {userNotifications.length !== 0 ? (
        userNotifications.map((notify) => {
          return (
            <div>
              <h2> {notify} </h2>
            </div>
          );
        })
      ) : (
        <p>Notificaion component</p>
      )}
    </div>
  );
};

export default UserNotifications;
