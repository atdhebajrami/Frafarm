import React from "react";
import "./FermeriProductsItem.css";

const FermeriProductsItem = (props) => {
    return(
        <div className="FermeriProductsItemBox">
            <div className="FermeriProductsItemImgBox">
                <img className="FermeriProductsItemImg" src={props.productData.imageURL} alt="ItemImage"/>
            </div>
            <div className="FermeriProductsItemTextBox">
                <h5 className="FermeriProductsItemText">Title: {props.productData.title}</h5>
                <h5 className="FermeriProductsItemText">Price: {props.productData.price}</h5>
                <h5 className="FermeriProductsItemText">Location: {props.productData.location}</h5>
            </div>
        </div>
    );
}

export default FermeriProductsItem;