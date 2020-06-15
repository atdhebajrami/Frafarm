import React from "react";
import "./BlersiItem.css";

const BlersiProductsItem = (props) => {

    const details = () => {
        let product = {
            id: props.productData.id,
            imageURL: props.productData.imageURL,
            title: props.productData.title,
            price: props.productData.price,
            location: props.productData.location,
            description: props.productData.description
        }
        localStorage.setItem("BlersiProductsDetails", JSON.stringify(product));
        props.history.push("/Blersi/Products/Details");
    }

    return(
        <div onClick={() => details()} className="BlersiProductsItemBox">
            <div className="BlersiProductsItemImgBox">
                <img className="BlersiProductsItemImg" src={props.productData.imageURL} alt="ItemImage"/>
            </div>
            <div className="BlersiProductsItemTextBox">
                <h5 className="BlersiProductsItemText">Title: {props.productData.title}</h5>
                <h5 className="BlersiProductsItemText">Price: {props.productData.price}</h5>
                <h5 className="BlersiProductsItemText">Location: {props.productData.location}</h5>
            </div>
        </div>
    );
}

export default BlersiProductsItem;