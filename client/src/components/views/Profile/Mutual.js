import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { USER_SERVER } from "../../../components/Config";
import DisplayProfile from "../../DisplayProfile";
import { Button } from "antd";

const Mutual = () => {
  const [mutualProfiles, setMutualProfiles] = useState([]);
  const [user, setUser] = useState([]);

  useEffect(() => {
    getMutualProfiles();
  }, []);

  const getMutualProfiles = async () => {
    var id = localStorage.getItem("userId");
    await axios
      .get(`${USER_SERVER}/mutualprofile?userId=${id}`)
      .then((res) => {
        setMutualProfiles(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getUser();
  }, [getMutualProfiles]);

  const getUser = () => {
    const id = localStorage.getItem("userId");
    console.log(mutualProfiles);
    mutualProfiles.map((mutual) => {
      if (id == mutual.user1) {
        setUser(mutual.user2);
      } else {
        setUser(mutual.user1);
      }
    });
    console.log(user);
  };
  return (
    <div>
      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <h1> Mutual Liked Profiles </h1>
      </div>
      <div className="home-container">
        {mutualProfiles.length !== 0 ? (
          mutualProfiles.map((mutual) => {
            return (
              <DisplayProfile
                key={mutual._id}
                user={user}
                likedProfile={true}
                mutualLiked={true}
              />
            );
          })
        ) : (
          <h2> No Mutually Liked profiles so far... </h2>
        )}
      </div>
    </div>
  );
};

export default Mutual;
