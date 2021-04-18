import React, { Suspense, useEffect } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Auth from "../hoc/auth";
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

//null   Anyone Can go inside
//true   only logged in user can go inside
//false  logged in user can't go inside

function App() {
  const isloggedin = localStorage.getItem("userId");
  useEffect(() => {}, []);
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

          <Route path="/home" component={Auth(Home, false)} />
          <Route path="/" component={Auth(LandingPage, false)} />
        </Switch>
      </div>
      <Footer />
    </Suspense>
  );
}

export default App;
