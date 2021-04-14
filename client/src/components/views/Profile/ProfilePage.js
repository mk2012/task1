import React from "react";
import { Avatar, Upload, message, Button } from "antd";
import { Link } from "react-router-dom";
import {
  UploadOutlined,
  UserOutlined,
  EditOutlined,
  CameraOutlined,
} from "@ant-design/icons";

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

const ProfilePage = () => {
  return (
    <div>
      <div className="container">
        <Avatar size={128} icon={<UserOutlined />} />
        <div style={{ display: "flex" }}>
          <Upload {...props}>
            <Button style={{ marginTop: "10px" }}>
              {<UploadOutlined />} {<CameraOutlined />}
            </Button>
          </Upload>
          <Link to="/myprofile/bio">
            <Button style={{ marginTop: "10px" }}>
              {<EditOutlined />} Bio
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
