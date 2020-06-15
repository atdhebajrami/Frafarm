import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import './Signup.css';

const Signup = (props) =>{
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [telnumber, setTelNumber] = useState("");
    const [usernameStyle, setUsernameStyle] = useState("SignupUsername");
    const [emailStyle, setEmailStyle] = useState("SignupEmail");
    const [passwordStyle, setPasswordStyle] = useState("SignupPassword");
    const [telnumberStyle, setTelNumberStyle] = useState("SignupTelNumber");
    const [clientButtonStyle, setClientButtonStyle] = useState("ClientButtonUnSelected");
    const [farmerButtonStyle, setFarmerButtonStyle] = useState("FarmerButtonUnSelected");
    const [errorBoxStyle, setErrorBoxStyle] = useState("ErrorBoxHide");

    const signup = async () => {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        let txt = /\s/;
        let totalAccess = 0;
        let errora = 0;
        if(username.trim() === "" || txt.test(username) === true || username.length < 4 || username.length > 18){
            setUsernameStyle("SignupUsernameRED");
            errora++;
        }else{
            totalAccess = totalAccess + 1;
            setUsernameStyle("SignupUsername");
        }
        if(email.trim() === "" || reg.test(email) === false){
            setEmailStyle("SignupEmailRED");
            errora++;
        }else{
            totalAccess = totalAccess + 1;
            setEmailStyle("SignupEmail");
        }
        if(password.trim() === "" || txt.test(password) === true || password.length < 6 || password.length > 30){
            setPasswordStyle("SignupPasswordRED");
            errora++;
        }else{
            totalAccess = totalAccess + 1;
            setPasswordStyle("SignupPassword");
        }
        if(telnumber.trim() === "" || telnumber.length < 6 || telnumber.length > 30){
            setTelNumberStyle("SignupTelNumberRED");
            errora++;
        }else{
            totalAccess = totalAccess + 1;
            setTelNumberStyle("SignupTelNumber");
        }
        if(clientButtonStyle === "ClientButtonUnSelected" && farmerButtonStyle === "FarmerButtonUnSelected"){
            errora++;
            setClientButtonStyle("ClientButtonUnSelectedRED");
            setFarmerButtonStyle("FarmerButtonUnSelectedRED");
        }
        var tipiAccount = "";
        if(clientButtonStyle === "ClientButtonSelected"){
            totalAccess = totalAccess + 1;
            tipiAccount = "Blersi";
        }
        if(farmerButtonStyle === "FarmerButtonSelected"){
            totalAccess = totalAccess + 1;
            tipiAccount = "Fermeri";
        }

        if(errora !== 0){
            setErrorBoxStyle("ErrorBox");
        }
        if(totalAccess === 5){
            let apicall = await fetch("http://frafarm.herokuapp.com/Signup",{
                method: "post",
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({
                    "username": username,
                    "email": email,
                    "password": password,
                    "telnumber": telnumber,
                    "tipiAccount": tipiAccount
                })
            })
            let response = await apicall.json();
            if(response.success === true){
                let user = {
                    uid: response.uid,
                    tipiAccount: tipiAccount
                }
                localStorage.setItem("FrafarmUser", JSON.stringify(user));
                if(tipiAccount === "Blersi"){
                    props.history.push("/Blersi/");
                }
                if(tipiAccount === "Fermeri"){
                    props.history.push("/Fermeri/");
                }
                setUsername("");
                setEmail("");
                setPassword("");
                setTelNumber("");
            }else{
                setErrorBoxStyle("ErrorBox");
                if(response.emailError === true){
                    setEmailStyle("SignupEmailRED");
                }else{
                    setEmailStyle("SignupEmail");
                }
                if(response.usernameError === true){
                    setUsernameStyle("SignupUsernameRED");
                }else{
                    setUsernameStyle("SignupUsername");
                }
            }
        }
    }

    const changeType = (type) => {
        if(type === "client"){
            setClientButtonStyle("ClientButtonSelected");
            setFarmerButtonStyle("FarmerButtonUnSelected");
        }
        if(type === "farmer"){
            setClientButtonStyle("ClientButtonUnSelected");
            setFarmerButtonStyle("FarmerButtonSelected");
        }
    }

    return(
        <div className="SignupBox">
            <h5 className="SignupText">Sign up</h5>
            <div className="SignupInputBox">
                <div className={errorBoxStyle}>
                    <h5 className="ErrorText">Sign up failed.</h5>
                    <img onClick={() => setErrorBoxStyle("ErrorBoxHide")} className="ErrorButton" src={require("../Images/xButton.png")} alt="X"/>
                </div>
                <input className={usernameStyle} type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username"/>
                <input className={emailStyle} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"/>
                <input className={passwordStyle} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"/>
                <input className={telnumberStyle} type="number" value={telnumber} onChange={(e) => setTelNumber(e.target.value)} placeholder="Tel. Number"/>
                <div className="ClientFarmerBox">
                    <button onClick={() => changeType("client")} className={clientButtonStyle}>Client</button>
                    <button onClick={() => changeType("farmer")} className={farmerButtonStyle}>Farmer</button>
                </div>
                <button className="SignupButton" type="submit" onClick={() => signup()}>Sign up</button>
                <h5 className="NotaMember">Already registred ? <Link className="Linku" to="/Login">Log in</Link></h5>
            </div>
        </div>
    );
}

export default Signup;