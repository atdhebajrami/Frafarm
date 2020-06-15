import React, { useState, useEffect } from "react";
import "./FermeriProfile.css";

const FermeriProfile = () => {
    const [userUsername, setUserUsername] = useState("");
    const [profileUsername, setProfileUsername] = useState("");
    const [profileEmail, setProfileEmail] = useState("");
    const [profilePassword, setProfilePassword] = useState("");
    const [profileTelNumber, setProfileTelNumber] = useState("");
    const [profileUsernameStyle, setProfileUsernameStyle] = useState("FermeriProfileInputUsername");
    const [profileEmailStyle, setProfileEmailStyle] = useState("FermeriProfileInputEmail");
    const [profilePasswordStyle, setProfilePasswordStyle] = useState("FermeriProfileInputPassword");
    const [profileTelNumberStyle, setProfileTelNumberStyle] = useState("FermeriProfileInputTelNumber");
    const [profileErrorBoxStyle, setProfileErrorBoxStyle] = useState("FermeriProfileErrorBoxHide");
    const [profileSuccessBoxStyle, setProfileSuccessBoxStyle] = useState("FermeriProfileSuccessBoxHide");

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
            telnumber: ""
        };
        
        if(profileUsername !== ""){
            if(profileUsername.trim() === "" || txt.test(profileUsername) === true || profileUsername.length < 4 || profileUsername.length > 18){
                setProfileUsernameStyle("FermeriProfileInputUsernameRED");
                errora++;
            }else{
                totalAccess = totalAccess + 1;
                user.username = profileUsername;
                setProfileUsernameStyle("FermeriProfileInputUsername");
            }
        }else{
            setProfileUsernameStyle("FermeriProfileInputUsername");
            noinput++;
        }
        if(profileEmail !== ""){
            if(profileEmail.trim() === "" || reg.test(profileEmail) === false){
                setProfileEmailStyle("FermeriProfileInputEmailRED");
                errora++;
            }else{
                totalAccess = totalAccess + 1;
                user.email = profileEmail;
                setProfileEmailStyle("FermeriProfileInputEmail");
            }
        }else{
            setProfileEmailStyle("FermeriProfileInputEmail");
            noinput++;
        }
        if(profilePassword !== ""){
            if(profilePassword.trim() === "" || txt.test(profilePassword) === true || profilePassword.length < 6 || profilePassword.length > 30){
                setProfilePasswordStyle("FermeriProfileInputPasswordRED");
                errora++;
            }else{
                totalAccess = totalAccess + 1;
                user.password = profilePassword;
                setProfilePasswordStyle("FermeriProfileInputPassword");
            }
        }else{
            setProfilePasswordStyle("FermeriProfileInputPassword");
            noinput++;
        }
        if(profileTelNumber !== ""){
            if(profileTelNumber.trim() === "" || profileTelNumber.length < 6 || profileTelNumber.length > 30){
                setProfileTelNumberStyle("FermeriProfileInputTelNumberRED");
                errora++;
            }else{
                totalAccess = totalAccess + 1;
                user.telnumber = profileTelNumber;
                setProfileTelNumberStyle("FermeriProfileInputTelNumber");
            }
        }else{
            setProfileTelNumberStyle("FermeriProfileInputTelNumber");
            noinput++;
        }

        if(errora !== 0){
            setProfileErrorBoxStyle("FermeriProfileErrorBox");
            setProfileSuccessBoxStyle("FermeriProfileSuccessBoxHide");
        }
        if(noinput === 4){
            setProfileErrorBoxStyle("FermeriProfileErrorBoxHide");
            setProfileSuccessBoxStyle("FermeriProfileSuccessBoxHide");
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
                setProfileSuccessBoxStyle("FermeriProfileSuccessBox");
                setProfileErrorBoxStyle("FermeriProfileErrorBoxHide");
                if(profileUsername !== ""){
                    setUserUsername(profileUsername);
                }
                setProfileUsername("");
                setProfileEmail("");
                setProfilePassword("");
                setProfileTelNumber("");
            }else{
                setProfileErrorBoxStyle("FermeriProfileErrorBox");
                setProfileSuccessBoxStyle("FermeriProfileSuccessBoxHide");
                if(response.emailError === true){
                    setProfileEmailStyle("FermeriProfileInputEmailRED");
                }else{
                    setProfileEmailStyle("FermeriProfileInputEmail");
                }
                if(response.usernameError === true){
                    setProfileUsernameStyle("FermeriProfileInputUsernameRED");
                }else{
                    setProfileUsernameStyle("FermeriProfileInputUsername");
                }
            }
        }
    }

    return(
        <div className="FermeriProfileBox">
            <div className="FermeriProfileInputBox">
                <div className={profileSuccessBoxStyle}>
                    <h5 className="FermeriProfileSuccessText">Successfully updated.</h5>
                    <img onClick={() => setProfileSuccessBoxStyle("FermeriProfileSuccessBoxHide")} className="FermeriProfileSuccessButton" src={require("../Images/xButton.png")} alt="X"/>
                </div>
                <div className={profileErrorBoxStyle}>
                    <h5 className="FermeriProfileErrorText">Update failed.</h5>
                    <img onClick={() => setProfileErrorBoxStyle("FermeriProfileErrorBoxHide")} className="FermeriProfileErrorButton" src={require("../Images/xButton.png")} alt="X"/>
                </div>
                <h5 className="FermeriProfileTitle">Profile</h5>
                <h5 className="FermeriProfileHiUsername">Hi, {userUsername}</h5>
                <input className={profileUsernameStyle} type="text" value={profileUsername} onChange={(e) => setProfileUsername(e.target.value)} placeholder="New Username"/>
                <input className={profileEmailStyle} type="email" value={profileEmail} onChange={(e) => setProfileEmail(e.target.value)} placeholder="New Email"/>
                <input className={profilePasswordStyle} type="password" value={profilePassword} onChange={(e) => setProfilePassword(e.target.value)} placeholder="New Password"/>
                <input className={profileTelNumberStyle} type="number" value={profileTelNumber} onChange={(e) => setProfileTelNumber(e.target.value)} placeholder="New Tel. Number"/>
                <button onClick={() => Update()} className="FermeriProfileButton">Update</button>
            </div>
        </div>
    );
}

export default FermeriProfile;