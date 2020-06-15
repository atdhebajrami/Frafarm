import React from "react";
import "./FermeriProductsItem.css";

const FermeriProductsItem = (props) => {

    const deleteProduct = () => {
        let product = {
            id: props.productData.id,
            imagePublicID: props.productData.imagePublicID,
            title: props.productData.title,
        }
        localStorage.setItem("FermeriDeleteProduct", JSON.stringify(product));
        props.history.push("/Fermeri/Products/DeleteProduct");
    }

    const editProduct = () => {
        let product = {
            id: props.productData.id,
            imageURL: props.productData.imageURL,
            imagePublicID: props.productData.imagePublicID,
            title: props.productData.title,
            price: props.productData.price,
            location: props.productData.location,
            description: props.productData.description,
        }
        localStorage.setItem("FermeriEditProduct", JSON.stringify(product));
        props.history.push("/Fermeri/Products/EditProduct");
    }

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
            <div className="FermeriProductsItemButtonBox">
                <img onClick={() => deleteProduct()} className="FermeriProductsItemDeleteButton" src={require("../Images/xButton.png")} alt="X"/>
                <img onClick={() => editProduct()} className="FermeriProductsItemEditButton" src={require("../Images/Edit.png")} alt="Edit"/>
            </div>
        </div>
    );
}

export default FermeriProductsItem;