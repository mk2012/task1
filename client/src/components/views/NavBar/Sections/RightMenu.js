/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { Menu, message } from "antd";
import axios from "axios";
import { USER_SERVER } from "../../../Config";
import { withRouter } from "react-router-dom";
import { useSelector } from "react-redux";

function RightMenu(props) {
  const user = useSelector((state) => state.user);
  const isloggedin = localStorage.getItem("userId");

  const logoutHandler = () => {
    axios.get(`${USER_SERVER}/logout`).then((response) => {
      if (response.status === 200) {
        localStorage.removeItem("userId");
        message.info("Log out successful");
        props.history.push("/login");
      } else {
        alert("Log Out Failed");
      }
    });
  };

  // if (isloggedin == null && user.userData && !user.userData.isAuth)

  if (isloggedin == null) {
    return (
      <Menu mode={props.mode}>
        <Menu.Item key="mail">
          <a href="/login">Signin</a>
        </Menu.Item>
        <Menu.Item key="app">
          <a href="/register">Signup</a>
        </Menu.Item>
      </Menu>
    );
  } else {
    return (
      <Menu mode={props.mode}>
        <Menu.Item key="logout">
          <a onClick={logoutHandler}>Logout</a>
        </Menu.Item>
      </Menu>
    );
  }
}

export default withRouter(RightMenu);
