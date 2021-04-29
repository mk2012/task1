import React, { Suspense, useEffect } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { message, notification } from "antd";

import Auth from "../hoc/auth";
import io from "socket.io-client";
// pages for this product
import LandingPage from "./views/LandingPage/LandingPage.js";
import LoginPage from "./views/LoginPage/LoginPage.js";
import RegisterPage from "./views/RegisterPage/RegisterPage.js";
import NavBar from "./views/NavBar/NavBar";
import Footer from "./views/Footer/Footer";
import ProfilePage from "./views/Profile/ProfilePage";
import AddBio from "./views/Profile/addBio";
import Home from "./views/LandingPage/Home";
import LikedProfiles from "../components/views/Profile/LikedProfiles";
import Mutual from "../components/views/Profile/Mutual";
import ChatPage from "../components/views/Message/ChatPage";

//null   Anyone Can go inside
//true   only logged in user can go inside
//false  logged in user can't go inside
const Context = React.createContext({ name: "Default" });
function App() {
  const isloggedin = localStorage.getItem("userId");

  useEffect(() => {}, []);
  useEffect(() => {
    var socket = io("http://localhost:8002", {
      transports: ["websocket", "polling", "flashsocket"],
    });

    socket.on("notification", (msg) => {
      message.success("New message", msg.message);
    });

    var socket2 = io("http://localhost:8003", {
      transports: ["websocket", "polling", "flashsocket"],
    });
    socket2.on("MutualNotify", (mutual) => {
      console.log("2");
      openNotification();
    });
  }, []);

  const openNotification = () => {
    notification.open({
      message: "New Mutual Liked Profile",
      description:
        "You have new Mutually Liked Profile.See who it is! Start Chatting...",
      className: "custom-class",
      style: {
        width: 600,
      },
    });
  };
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NavBar />
      <div style={{ paddingTop: "69px", minHeight: "calc(100vh - 80px)" }}>
        <Switch>
          <Route path="/login" component={Auth(LoginPage, false)} />
          <Route path="/likedprofiles" component={Auth(LikedProfiles, false)} />
          <Route path="/register" component={Auth(RegisterPage, false)} />
          <Route path="/myprofile/bio" component={Auth(AddBio, false)} />
          <Route path="/myprofile" component={Auth(ProfilePage, false)} />
          <Route path="/chats" component={Auth(ChatPage, false)} />
          <Route path="/mutualprofile" component={Auth(Mutual, false)} />
          <Route path="/home" component={Auth(Home, false)} />
          {!isloggedin ? (
            <Route path="/" component={Auth(LandingPage, false)} />
          ) : (
            <Route path="/" component={Auth(Home, false)} />
          )}
        </Switch>
      </div>
      <Footer />
    </Suspense>
  );
}

export default App;
