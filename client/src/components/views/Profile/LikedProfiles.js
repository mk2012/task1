import React, { useEffect, useState } from "react";
import { USER_SERVER } from "../../Config";
import axios from "axios";
import DisplayProfile from "../../DisplayProfile";

const LikedProfiles = () => {
  const [likedprofiles, setLikedProfiles] = useState([]);
  const [data, setData] = useState([]);
  const [name, setName] = useState([]);

  useEffect(() => {
    const id = localStorage.getItem("userId");
    const getLikedProfiles = async () => {
      await axios
        .get(`${USER_SERVER}/useraction`)
        .then((res) => {
          setLikedProfiles(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    getLikedProfiles();
  }, []);

  // useEffect(() => {
  //   likedprofile.map((user) => {
  //       let thisUserId = localStorage.getItem("userId");

  //       const getLikedUsers = async () => {
  //         let id = user.likedFor;
  //         if (thisUserId == user.likedBy)
  //           await axios.get(`${USER_SERVER}/users/${id}`).then((res) => {
  //             console.log(res.data);
  //             setData(res.data.description);
  //             setName(res.data.oname);
  //           });
  //       };
  //       getLikedUsers();
  //     },
  //     [LikedProfiles]
  //   );
  // });
  const sendId = async (user, act) => {
    const senderId = localStorage.getItem("userId");
    var recieverId = user.likedFor;
    var data = { recieverId, senderId, action: act };
    await axios
      .post(`${USER_SERVER}/useraction/`, data)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      {likedprofiles.map((user) => {
        return (
          <DisplayProfile
            user={user.likedFor}
            sendId={(user, action) => sendId(user, action)}
          />
        );
      })}
    </div>
  );
};

export default LikedProfiles;
