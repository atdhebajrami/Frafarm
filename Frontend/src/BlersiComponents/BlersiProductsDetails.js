import React, { useState, useEffect } from "react";
import "./BlersiProductsDetails.css";

const BlersiProductsDetails = () => {
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
        var userLocal = JSON.parse(localStorage.getItem("FrafarmUser"));
        var product = JSON.parse(localStorage.getItem("BlersiProductsDetails"));
        let apicall = await fetch("http://frafarm.herokuapp.com/Blersi/Products/Details",{
                method: "post",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "uid": userLocal.uid,
                    "productID": product.id
                })
            })
            let response = await apicall.json();
            if(response.success === true){
                setImage(product.imageURL);
                setTitle(product.title);
                setPrice(product.price);
                setLocation(product.location);
                setOwner(response.owner);
                setTelNumber(response.telnumber);
                setDescription(product.description);
            }
    }

    const Add = async () => {
        var userLocal = JSON.parse(localStorage.getItem("FrafarmUser"));
        var product = JSON.parse(localStorage.getItem("BlersiProductsDetails"));
        let apicall = await fetch("http://frafarm.herokuapp.com/Blersi/Products/AddOrder",{
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "uid": userLocal.uid,
                "productID": product.id
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
        <div className="BlersiProductsDetailsBox">
            <div className="BlersiProductsDetailsContent">
                <div className={profileSuccessBoxStyle}>
                    <h5 className="BlersiProfileSuccessText">Successfully added.</h5>
                    <img onClick={() => setProfileSuccessBoxStyle("BlersiProfileSuccessBoxHide")} className="BlersiProfileSuccessButton" src={require("../Images/xButton.png")} alt="X"/>
                </div>
                <div className={profileErrorBoxStyle}>
                    <h5 className="BlersiProfileErrorText">Add failed.</h5>
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
                <h5 className="BlersiProductsDetailsOwner">Owner: {owner}</h5>
                <h5 className="BlersiProductsDetailsNrTel">Nr. tel: {telnumber}</h5>
                <h5 className="BlersiProductsDetailsDescTitle">Description</h5>
                <h5 className="BlersiProductsDetailsDescText">{description}</h5>
            </div>
            <div className="BlersiProductsDetailsButtonBox">
                <button onClick={() => Add()} className="BlersiProductsDetailsButton">Add to Orders</button>
            </div>
        </div>
    );
}

export default BlersiProductsDetails;