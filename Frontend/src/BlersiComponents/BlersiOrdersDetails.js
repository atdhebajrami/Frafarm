import React, { useState, useEffect } from "react";
import "./BlersiOrdersDetails.css";

const BlersiOrdersDetails = () => {
    const [image, setImage] = useState(require("../Images/AddImage.png"));
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [location, setLocation] = useState("");
    const [owner, setOwner] = useState("");
    const [telnumber, setTelNumber] = useState("");
    const [description, setDescription] = useState("");
    const [profileSuccessBoxStyle, setProfileSuccessBoxStyle] = useState("BlersiProfileSuccessBoxHide");
    const [profileErrorBoxStyle, setProfileErrorBoxStyle] = useState("BlersiProfileErrorBoxHide");

    useEffect(() => {
        start();
    }, [])

    const start = async () => {
        let userLocal = JSON.parse(localStorage.getItem("FrafarmUser"));
        let order = JSON.parse(localStorage.getItem("BlersiOrdersDetails"));
        let apicall = await fetch("http://frafarm.herokuapp.com/Blersi/Orders/Details",{
            method: "post",
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                "uid": userLocal.uid,
                "productID": order.productID,
                "orderID": order.orderID
            })
        })
        let response = await apicall.json();
        if(response.success === true){
            setImage(response.productData.imageURL);
            setTitle(response.productData.title);
            setPrice(response.productData.price);
            setLocation(response.productData.location);
            setDescription(response.productData.description);
            setOwner(response.fermeriData.owner);
            setTelNumber(response.fermeriData.telnumber);
        }
    }

    const DeleteDone = async () => {
        let userLocal = JSON.parse(localStorage.getItem("FrafarmUser"));
        let order = JSON.parse(localStorage.getItem("BlersiOrdersDetails"));
        let apicall = await fetch("http://frafarm.herokuapp.com/Blersi/Orders/DeleteOrder",{
            method: "post",
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                "uid": userLocal.uid,
                "productID": order.productID,
                "orderID": order.orderID
            })
        })
        let response = await apicall.json();
        if(response.success === true){
            setProfileSuccessBoxStyle("BlersiProfileSuccessBox");
            setProfileErrorBoxStyle("BlersiProfileErrorBoxHide");
        }else{
            setProfileSuccessBoxStyle("BlersiProfileSuccessBoxHide");
            setProfileErrorBoxStyle("BlersiProfileErrorBox");
        }
    }

    return(
        <div className="BlersiOrdersDetailsBox">
            <div className="BlersiOrdersDetailsContent">
                <div className={profileSuccessBoxStyle}>
                    <h5 className="BlersiProfileSuccessText">Successfully deleted.</h5>
                    <img onClick={() => setProfileSuccessBoxStyle("BlersiProfileSuccessBoxHide")} className="BlersiProfileSuccessButton" src={require("../Images/xButton.png")} alt="X"/>
                </div>
                <div className={profileErrorBoxStyle}>
                    <h5 className="BlersiProfileErrorText">Delete failed.</h5>
                    <img onClick={() => setProfileErrorBoxStyle("BlersiProfileErrorBoxHide")} className="BlersiProfileErrorButton" src={require("../Images/xButton.png")} alt="X"/>
                </div>
                <div className="BlersiProductsItemBox">
                    <div className="BlersiProductsItemImgBox">
                        <img className="BlersiProductsItemImg" src={image} alt="ItemImage"/>
                    </div>
                    <div className="BlersiProductsItemTextBox">
                        <h5 className="BlersiProductsItemText">Title: {title}</h5>
                        <h5 className="BlersiProductsItemText">Price: {price}</h5>
                        <h5 className="BlersiProductsItemText">Location: {location}</h5>
                    </div>
                </div>
                <h5 className="BlersiOrdersDetailsOwner">Owner: {owner}</h5>
                <h5 className="BlersiOrdersDetailsNrTel">Nr. tel: {telnumber}</h5>
                <h5 className="BlersiOrdersDetailsDescTitle">Description</h5>
                <h5 className="BlersiOrdersDetailsDescText">{description}</h5>
            </div>
            <div className="BlersiOrdersDetailsButtonBox">
                <button onClick={() => DeleteDone()} className="BlersiOrdersDetailsButton">Delete / Done</button>
            </div>
        </div>
    );
}

export default BlersiOrdersDetails;