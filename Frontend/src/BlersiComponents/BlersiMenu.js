import React from "react";
import "./BlersiMenu.css";

const BlersiMenu = (props) => {

    return(
        <div className="BlersiMenu">
            <div onClick={() => props.history.push("/Blersi/Products")} className="BlersiMenuItem">
                <img className="BlersiMenuImg" src={require("../Images/Products.jpg")} alt="Products"/>
                <h5 className="BlersiMenuText">Products</h5>
            </div>
            <div onClick={() => props.history.push("/Blersi/Orders")} className="BlersiMenuItem">
                <img className="BlersiMenuImg" src={require("../Images/Orders.jpg")} alt="Orders"/>
                <h5 className="BlersiMenuText">Orders</h5>
            </div>
            <div onClick={() => props.history.push("/Blersi/Profile")} className="BlersiMenuItem">
                <div className="BlersiMenuProfileImgContainer">
                    <img className="BlersiMenuProfileImg" src={require("../Images/Profile.png")} alt="Profile"/>
                </div>
                <h5 className="BlersiMenuText">Profile</h5>
            </div>
        </div>
    );
}

export default BlersiMenu;