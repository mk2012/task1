import React from "react";
import { useEffect, useState } from "react";
import { Avatar, Upload, message, Button } from "antd";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { USER_SERVER } from "../../Config";
import axios from "axios";
import {
  UploadOutlined,
  UserOutlined,
  EditOutlined,
  CameraOutlined,
} from "@ant-design/icons";

const id = localStorage.getItem("userId");
const props = {
  name: "file",
  action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
  headers: {
    authorization: "authorization-text",
  },
  onChange(info) {
    if (info.file.status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};

const ProfilePage = (props) => {
  const id = localStorage.getItem("userId");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  useEffect(() => {
    axios
      .get(`${USER_SERVER}/myprofile/${id}`)
      .then((res) => {
        console.log(res.data);
        setName(res.data.name);
        setBio(res.data.description);
      })
      .catch((err) => {
        console.log(err);
      });
    axios.post();
  }, [name, bio]);
  return (
    <div>
      <div className="container">
        <div className="profile-container">
          <Avatar size={128} icon={<UserOutlined />} />
          <h1>{name !== undefined ? name : ""}</h1>
          <h2>{bio !== undefined ? bio : ""} </h2>
          <div style={{ display: "flex" }}>
            <Upload {...props}>
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
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
