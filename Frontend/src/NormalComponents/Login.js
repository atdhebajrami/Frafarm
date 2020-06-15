import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import './Login.css';

const Login = (props) =>{
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [usernameStyle, setUsernameStyle] = useState("LoginUsername");
    const [passwordStyle, setPasswordStyle] = useState("LoginPassword");
    const [errorBoxStyle, setErrorBoxStyle] = useState("ErrorBoxHide");

    const login = async() => {
        let txt = /\s/;
        let totalAccess = 0;
        let errora = 0;
        if(username.trim() === "" || txt.test(username) === true || username.length < 4 || username.length > 18){
            setUsernameStyle("LoginUsernameRED");
            errora++;
        }else{
            totalAccess = totalAccess + 1;
            setUsernameStyle("LoginUsername");
        }
        if(password.trim() === "" || txt.test(password) === true || password.length < 6 || password.length > 30){
            setPasswordStyle("LoginPasswordRED");
            errora++;
        }else{
            totalAccess = totalAccess + 1;
            setPasswordStyle("LoginPassword");
        }

        if(errora !== 0){
            setErrorBoxStyle("ErrorBox");
        }
        if(totalAccess === 2){
            // Logged in Successfully
            let apicall = await fetch("http://frafarm.herokuapp.com/Login",{
                method: "post",
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({
                    "username": username,
                    "password": password
                })
            })
            let response = await apicall.json();
            if(response.success === true){
                let user = {
                    uid: response.uid,
                    tipiAccount: response.tipiAccount
                }
                localStorage.setItem("FrafarmUser", JSON.stringify(user));
                if(response.tipiAccount === "Blersi"){
                    props.history.push("/Blersi/");
                }
                if(response.tipiAccount === "Fermeri"){
                    props.history.push("/Fermeri/");
                }
                setUsernameStyle("LoginUsername");
                setPasswordStyle("LoginPassword");
                setUsername("");
                setPassword("");
            }else{
                setErrorBoxStyle("ErrorBox");
                setUsernameStyle("LoginUsernameRED");
                setPasswordStyle("LoginPasswordRED");
            }
        }
    }

    return(
        <div className="LoginBox">
            <h5 className="LoginText">Log in</h5>
            <div className="LoginInputBox">
                <div className={errorBoxStyle}>
                    <h5 className="ErrorText">Log in failed.</h5>
                    <img onClick={() => setErrorBoxStyle("ErrorBoxHide")} className="ErrorButton" src={require("../Images/xButton.png")} alt="X"/>
                </div>
                <input className={usernameStyle} type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username"/>
                <input className={passwordStyle} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"/>
                <h5 className="ForgotPassword"><Link className="Linku" to="/ForgotPassword">Forgot password ?</Link></h5>
                <button className="LoginButton" type="submit" onClick={() => login()}>Log in</button>
                <h5 className="NotaMember">Not a member ? <Link className="Linku" to="/Signup">Sign up</Link></h5>
            </div>
        </div>
    );
}

export default Login;