import React, { useState, useEffect } from "react";
import "./BlersiProfile.css";

const BlersiProfile = () => {
    const [userUsername, setUserUsername] = useState("");
    const [profileUsername, setProfileUsername] = useState("");
    const [profileEmail, setProfileEmail] = useState("");
    const [profilePassword, setProfilePassword] = useState("");
    const [profileTelNumber, setProfileTelNumber] = useState("");
    const [profileUsernameStyle, setProfileUsernameStyle] = useState("BlersiProfileInputUsername");
    const [profileEmailStyle, setProfileEmailStyle] = useState("BlersiProfileInputEmail");
    const [profilePasswordStyle, setProfilePasswordStyle] = useState("BlersiProfileInputPassword");
    const [profileTelNumberStyle, setProfileTelNumberStyle] = useState("BlersiProfileInputTelNumber");
    const [profileErrorBoxStyle, setProfileErrorBoxStyle] = useState("BlersiProfileErrorBoxHide");
    const [profileSuccessBoxStyle, setProfileSuccessBoxStyle] = useState("BlersiProfileSuccessBoxHide");

    useEffect(() => {
        getUsername();
    }, [])

    const getUsername = async () => {
        let userLocal = JSON.parse(localStorage.getItem("FrafarmUser"));
            let apicall = await fetch("http://frafarm.herokuapp.com/Username",{
                method: "post",
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({
                    "uid": userLocal.uid,
                    "tipiAccount": userLocal.tipiAccount,
                })
            })
            let response = await apicall.json();
            if(response.success === true){
                setUserUsername(response.username);
            }
    }

    const Update = async () => {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        let txt = /\s/;
        let totalAccess = 0;
        let errora = 0;
        let noinput = 0;
        var user = {
            username: "",
            email: "",
            password: "",
            telnumber: "",
        };

        if(profileUsername !== ""){
            if(profileUsername.trim() === "" || txt.test(profileUsername) === true || profileUsername.length < 4 || profileUsername.length > 18){
                setProfileUsernameStyle("BlersiProfileInputUsernameRED");
                errora++;
            }else{
                totalAccess = totalAccess + 1;
                user.username = profileUsername;
                setProfileUsernameStyle("BlersiProfileInputUsername");
            }
        }else{
            setProfileUsernameStyle("BlersiProfileInputUsername");
            noinput++;
        }
        if(profileEmail !== ""){
            if(profileEmail.trim() === "" || reg.test(profileEmail) === false){
                setProfileEmailStyle("BlersiProfileInputEmailRED");
                errora++;
            }else{
                totalAccess = totalAccess + 1;
                user.email = profileEmail;
                setProfileEmailStyle("BlersiProfileInputEmail");
            }
        }else{
            setProfileEmailStyle("BlersiProfileInputEmail");
            noinput++;
        }
        if(profilePassword !== ""){
            if(profilePassword.trim() === "" || txt.test(profilePassword) === true || profilePassword.length < 6 || profilePassword.length > 30){
                setProfilePasswordStyle("BlersiProfileInputPasswordRED");
                errora++;
            }else{
                totalAccess = totalAccess + 1;
                user.password = profilePassword;
                setProfilePasswordStyle("BlersiProfileInputPassword");
            }
        }else{
            setProfilePasswordStyle("BlersiProfileInputPassword");
            noinput++;
        }
        if(profileTelNumber !== ""){
            if(profileTelNumber.trim() === "" || profileTelNumber.length < 6 || profileTelNumber.length > 30){
                setProfileTelNumberStyle("BlersiProfileInputTelNumberRED");
                errora++;
            }else{
                totalAccess = totalAccess + 1;
                user.telnumber = profileTelNumber;
                setProfileTelNumberStyle("BlersiProfileInputTelNumber");
            }
        }else{
            setProfileTelNumberStyle("BlersiProfileInputTelNumber");
            noinput++;
        }

        if(errora !== 0){
            setProfileErrorBoxStyle("BlersiProfileErrorBox");
            setProfileSuccessBoxStyle("BlersiProfileSuccessBoxHide");
        }
        if(noinput === 4){
            setProfileErrorBoxStyle("BlersiProfileErrorBoxHide");
            setProfileSuccessBoxStyle("BlersiProfileSuccessBoxHide");
        }
        if(totalAccess !== 0 && errora === 0){
            // Updated Successfully
            let userLocal = JSON.parse(localStorage.getItem("FrafarmUser"));
            let apicall = await fetch("http://frafarm.herokuapp.com/Profile",{
                method: "post",
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({
                    "uid": userLocal.uid,
                    "tipiAccount": userLocal.tipiAccount,
                    "username": user.username,
                    "email": user.email,
                    "password": user.password,
                    "telnumber": user.telnumber,
                })
            })
            let response = await apicall.json();
            if(response.success === true){
                setProfileSuccessBoxStyle("BlersiProfileSuccessBox");
                setProfileErrorBoxStyle("BlersiProfileErrorBoxHide");
                if(profileUsername !== ""){
                    setUserUsername(profileUsername);
                }
                setProfileUsername("");
                setProfileEmail("");
                setProfilePassword("");
                setProfileTelNumber("");
            }else{
                setProfileErrorBoxStyle("BlersiProfileErrorBox");
                setProfileSuccessBoxStyle("BlersiProfileSuccessBoxHide");
                if(response.emailError === true){
                    setProfileEmailStyle("BlersiProfileInputEmailRED");
                }else{
                    setProfileEmailStyle("BlersiProfileInputEmail");
                }
                if(response.usernameError === true){
                    setProfileUsernameStyle("BlersiProfileInputUsernameRED");
                }else{
                    setProfileUsernameStyle("BlersiProfileInputUsername");
                }
            }
        }
    }

    return(
        <div className="BlersiProfileBox">
            <div className="BlersiProfileInputBox">
                <div className={profileSuccessBoxStyle}>
                    <h5 className="BlersiProfileSuccessText">Successfully updated.</h5>
                    <img onClick={() => setProfileSuccessBoxStyle("BlersiProfileSuccessBoxHide")} className="BlersiProfileSuccessButton" src={require("../Images/xButton.png")} alt="X"/>
                </div>
                <div className={profileErrorBoxStyle}>
                    <h5 className="BlersiProfileErrorText">Update failed.</h5>
                    <img onClick={() => setProfileErrorBoxStyle("BlersiProfileErrorBoxHide")} className="BlersiProfileErrorButton" src={require("../Images/xButton.png")} alt="X"/>
                </div>
                <h5 className="BlersiProfileTitle">Profile</h5>
                <h5 className="BlersiProfileHiUsername">Hi, {userUsername}</h5>
                <input className={profileUsernameStyle} type="text" value={profileUsername} onChange={(e) => setProfileUsername(e.target.value)} placeholder="New Username"/>
                <input className={profileEmailStyle} type="email" value={profileEmail} onChange={(e) => setProfileEmail(e.target.value)} placeholder="New Email"/>
                <input className={profilePasswordStyle} type="password" value={profilePassword} onChange={(e) => setProfilePassword(e.target.value)} placeholder="New Password"/>
                <input className={profileTelNumberStyle} type="number" value={profileTelNumber} onChange={(e) => setProfileTelNumber(e.target.value)} placeholder="New Tel. Number"/>
                <button onClick={() => Update()} className="BlersiProfileButton">Update</button>
            </div>
        </div>
    );
}

export default BlersiProfile;