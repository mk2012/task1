import React from "react";
import { useEffect, useState } from "react";
import { Avatar, Upload, message, Button } from "antd";
import { Link } from "react-router-dom";
import { USER_SERVER } from "../../Config";
import axios from "axios";
import {
  UploadOutlined,
  UserOutlined,
  EditOutlined,
  CameraOutlined,
  HeartFilled,
} from "@ant-design/icons";
import { useHistory, useLocation } from "react-router-dom";

var id = localStorage.getItem("userId");

const ProfilePage = (props) => {
  const id = localStorage.getItem("userId");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState("");
  const history = useHistory();
  const location = useLocation();

  const getUser = async () => {
    await axios
      .get(`${USER_SERVER}/myprofile/${id}`)
      .then((res) => {
        setName(res.data.name);
        setBio(res.data.description);
        setImage(res.data.image);
        setIsLoggedIn(id);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getUser();
  }, []);

  if (location.state == "added") {
    getUser();
  }

  // const getImage = async () => {
  //   await axios
  //     .get(`${USER_SERVER}/myprofile/${id}`)
  //     .then((res) => {
  //       if (res.data) {
  //         setImage(res.data.image);
  //       } else {
  //         setImage("");
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  const uploadImage = (options) => {
    const { onSuccess, onError, file, onProgress } = options;

    const fmData = new FormData();
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
      onUploadProgress: (event) => {
        // console.log((event.loaded / event.total) * 100);
        onProgress({ percent: (event.loaded / event.total) * 100 }, file);
      },
    };
    fmData.append("image", file);
    axios
      .post(`http://localhost:5001/user-profile?userId=${id}`, fmData, config)
      .then((res) => {
        onSuccess(file);
        message.success("Profile picture uploaded successfully");
        getUser();
      })
      .catch((err) => {
        const error = new Error("Some error");
        onError({ event: "error" });
      });
  };
  return (
    <div>
      {isLoggedIn ? (
        <div className="container">
          <h1
            style={{
              letterSpacing: "10px",
              color: "grey",
              textAlign: "center",
              marginTop: "20px",
            }}
          >
            PROFILE
          </h1>
          <div className="profile-container">
            <Avatar size={128} icon={<UserOutlined />} src={image} />
            <h1>{name !== undefined ? name : ""}</h1>
            <h2>{bio !== undefined ? bio : ""} </h2>
            <div style={{ display: "flex" }}>
              <Upload accept="image/*" customRequest={uploadImage}>
                <Button style={{ marginTop: "10px" }}>
                  {<UploadOutlined />} {<CameraOutlined />}
                </Button>
              </Upload>
              <Link to="/myprofile/bio">
                <Button style={{ marginTop: "10px", marginLeft: "10px" }}>
                  {<EditOutlined />} Bio
                </Button>
              </Link>
            </div>
            <div style={{ marginTop: "25px", width: "80%" }}>
              <Link to="likedprofiles">
                <Button
                  style={{
                    width: "100%",
                    backgroundColor: "palevioletred",
                    color: "white",
                  }}
                >
                  {<HeartFilled />} Favourites
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: "center", marginTop: "15px" }}>
          <h1> Register / Login to Create your Profiles </h1>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
