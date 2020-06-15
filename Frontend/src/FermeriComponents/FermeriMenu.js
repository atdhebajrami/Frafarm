import React from "react";
import { useState } from "react";
import "./FermeriMenu.css";

const FermeriMenu = (props) => {
    return(
        <div className="FermeriMenu">
            <div onClick={() => props.history.push("/Fermeri/Products")} className="FermeriMenuItem">
                <img className="FermeriMenuImg" src={require("../Images/Products.jpg")} alt="Products"/>
                <h5 className="FermeriMenuText">Products</h5>
            </div>
            <div onClick={() => props.history.push("/Fermeri/Orders")} className="FermeriMenuItem">
                <img className="FermeriMenuImg" src={require("../Images/Orders.jpg")} alt="Orders"/>
                <h5 className="FermeriMenuText">Orders</h5>
            </div>
            <div onClick={() => props.history.push("/Fermeri/Profile")} className="FermeriMenuItem">
                <div className="FermeriMenuProfileImgContainer">
                    <img className="FermeriMenuProfileImg" src={require("../Images/Profile.png")} alt="Profile"/>
                </div>
                <h5 className="FermeriMenuText">Profile</h5>
            </div>
        </div>
    );
}

export default FermeriMenu;