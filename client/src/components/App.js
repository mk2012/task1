import React, { Suspense } from "react";
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

//null   Anyone Can go inside
//true   only logged in user can go inside
//false  logged in user can't go inside

function App() {
  const isloggedin = localStorage.getItem("userId");
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NavBar />
      <div style={{ paddingTop: "69px", minHeight: "calc(100vh - 80px)" }}>
        <Switch>
          <Route exact path="/login" component={Auth(LoginPage, false)} />
          <Route exact path="/register" component={Auth(RegisterPage, false)} />
          <Route exact path="/myprofile" component={Auth(ProfilePage, false)} />
          {/* <Route exact path="/" component={Auth(Home, false)} /> */}
          <Route exact path="/myprofile/bio" component={Auth(AddBio, false)} />
          <Route exact path="/">
            {isloggedin ? <Redirect to="/" /> : <LandingPage />}
            {/* {Auth(LandingPage, null)} */}
          </Route>
        </Switch>
      </div>
      <Footer />
    </Suspense>
  );
}

export default App;
