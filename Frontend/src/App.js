import React from 'react';
import { useState, useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import AllReducers from "./Redux/Reducers/AllReducers";
import { createStore } from "redux";
import './App.css';
import LogoutButton from "./NormalComponents/LogoutButton";
import Hyrje from "./NormalComponents/Hyrje";
import BlersiPages from "./NormalComponents/BlersiPages";
import FermeriPages from "./NormalComponents/FermeriPages";

const store = createStore(AllReducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

function App(props) {
  const [menuClicked, setMenuClicked] = useState(false);
  const [menuItemsBox, setMenuItemsBox] = useState("LoginSignupMenu11");
  const [menuBoxStyle, setMenuBoxStyle] = useState("MenuBoxHIDE");
  const [loginsignupBoxStyle, setLoginSignupBoxStyle] = useState("LoginSignupBoxHIDE");
  const [vija1, setVija1] = useState("VijaHIDE");
  const [vija2, setVija2] = useState("VijaHIDE");
  const [vija3, setVija3] = useState("VijaHIDE");

  useEffect(() => {
    setTimeout(setViewport, 100);
    if(props.location.pathname === "/"){
      setMenuBoxStyle("MenuBox");
      setLoginSignupBoxStyle("LoginSignupBox");
      setMenuItemsBox("LoginSignupMenu11");
      setVija1("Vija1");
      setVija2("Vija2");
      setVija3("Vija3");
    }else{
      setMenuBoxStyle("MenuBoxHIDE");
      setLoginSignupBoxStyle("LoginSignupBoxHIDE");
      setMenuItemsBox("LoginSignupMenu11");
      setVija1("VijaHIDE");
      setVija2("VijaHIDE");
      setVija3("VijaHIDE");
    }
  }, [props.location.pathname])

  const setViewport = () => {
    let height = window.innerHeight;
    let width = window.innerWidth;
    let viewport = document.querySelector("meta[name=viewport]");
    viewport.setAttribute("content", "height=" + height + "px, width=" + width + "px, initial-scale=1.0");
  }

  const clickMenu = () => {
    if(menuClicked === false){
      setMenuClicked(true);
      setVija1("Vija11");
      setVija2("Vija22");
      setVija3("Vija33");
      setMenuItemsBox("LoginSignupMenu1");
    }
    if(menuClicked === true){
      setMenuClicked(false);
      setVija1("Vija1");
      setVija2("Vija2");
      setVija3("Vija3");
      setMenuItemsBox("LoginSignupMenu11");
    }
  }

  const goingToLoginSignup = (page) => {
    setMenuBoxStyle("MenuBoxHIDE");
    setLoginSignupBoxStyle("LoginSignupBoxHIDE");
    setMenuItemsBox("LoginSignupMenu11");

    if(page === "Signup"){
      setMenuBoxStyle("MenuBoxHIDE");
      setLoginSignupBoxStyle("LoginSignupBoxHIDE");
      setMenuItemsBox("LoginSignupMenu11");
      setVija1("VijaHIDE");
      setVija2("VijaHIDE");
      setVija3("VijaHIDE");
      props.history.push("/Signup");
    }
    if(page === "Login"){
      setMenuBoxStyle("MenuBoxHIDE");
      setLoginSignupBoxStyle("LoginSignupBoxHIDE");
      setMenuItemsBox("LoginSignupMenu11");
      setVija1("VijaHIDE");
      setVija2("VijaHIDE");
      setVija3("VijaHIDE");
      props.history.push("/Login");
    }
  }

  return (
    <Provider store={store}>
    <div className="App">
      <div className="Header">
        <img className="Img" src={require("./Images/header.png")} alt="Header"/>
        <h4 className="Frafarm">FRAFARM</h4>
        <LogoutButton history={props.history} />
        <div className={loginsignupBoxStyle}>
          <button onClick={() => goingToLoginSignup("Login")} className="LoginBtn">Log in</button>
          <button onClick={() => goingToLoginSignup("Signup")} className="SignupBtn">Sign up</button>
          </div>
        <div className={menuBoxStyle} onClick={() => clickMenu()}>
          <div className={vija1}></div>
          <div className={vija2}></div>
          <div className={vija3}></div>
        </div>
        <div className={menuItemsBox}>
          <h5 onClick={() => goingToLoginSignup("Login")} className="MenuItemLogin">Log in</h5>
          <h5 onClick={() => goingToLoginSignup("Signup")} className="MenuItemSignup">Sign up</h5>
        </div>
          </div>
            <Switch>
              <Route path="/Blersi/" component={BlersiPages} />
              <Route path="/Fermeri/" component={FermeriPages} />
              <Route path="/" component={Hyrje} />
            </Switch>
          <div className="Footer">
            <img className="Img" src={require("./Images/footer.png")} alt="Footer"/>
            <div className="FooterBox">
              <h6 className="FooterFrafarm">FRAFARM</h6>
              <div className="SocialMedias">
                <a href="https://www.facebook.com/">
                <img className="SM" src={require("./Images/facebooklogo.png")} alt="Facebook"/></a>
                <a href="https://www.instagram.com/">
                <img className="SM" src={require("./Images/instagramlogo.png")} alt="Instagram"/></a>
                <a href="https://www.twitter.com/">
                <img className="SM" src={require("./Images/twitterlogo.png")} alt="Twitter"/></a>
                <a href="https://www.linkedin.com/">
                <img className="SM" src={require("./Images/linkedinlogo.png")} alt="LinkedIn"/></a>
              </div>
            </div>
            </div>
    </div>
    </Provider>
  );
}

export default App;