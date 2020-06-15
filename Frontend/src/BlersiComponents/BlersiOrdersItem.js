import React, { useState, useEffect } from "react";
import "./BlersiItem.css";

const BlersiOrdersItem = (props) => {
    const [image, setImage] = useState(require("../Images/AddImage.png"));
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [location, setLocation] = useState("");

    useEffect(() => {
        if(title !== props.productData.title){
            setImage(props.productData.imageURL);
            setTitle(props.productData.title);
            setPrice(props.productData.price);
            setLocation(props.productData.location);
        }
    })

    const details = () => {
        let order = {
            orderID: props.productData.orderID,
            productID: props.productData.id,
        }
        localStorage.setItem("BlersiOrdersDetails", JSON.stringify(order));
        props.history.push("/Blersi/Orders/Details");
    }

    return(
        <div onClick={() => details()} className="BlersiProductsItemBox">
            <div className="BlersiProductsItemImgBox">
                <img className="BlersiProductsItemImg" src={image} alt="ItemImage"/>
            </div>
            <div className="BlersiProductsItemTextBox">
                <h5 className="BlersiProductsItemText">Title: {title}</h5>
                <h5 className="BlersiProductsItemText">Price: {price}</h5>
                <h5 className="BlersiProductsItemText">Location: {location}</h5>
            </div>
        </div>
    );
}

export default BlersiOrdersItem;