import React, { useState, useEffect } from "react";
import "./FermeriNewProduct.css";

const FermeriNewProduct = () => {
    const [imageFile, setImageFile] = useState("");
    const [imazhiInputRef, setImazhiInputRef] = useState("");
    const [image, setImage] = useState(require("../Images/AddImage.png"));
    const [newProductTitle, setNewProductTitle] = useState("");
    const [newProductPrice, setNewProductPrice] = useState("");
    const [newProductLocation, setNewProductLocation] = useState("");
    const [newProductDescription, setNewProductDescription] = useState("");
    const [newProductTitleStyle, setNewProductTitleStyle] = useState("FermeriNewProductTitleInput");
    const [newProductPriceStyle, setNewProductPriceStyle] = useState("FermeriNewProductPriceInput");
    const [newProductLocationStyle, setNewProductLocationStyle] = useState("FermeriNewProductLocationInput");
    const [newProductDescriptionStyle, setNewProductDescriptionStyle] = useState("FermeriNewProductDescriptionInput");
    const [newProductErrorBoxStyle, setNewProductErrorBoxStyle] = useState("FermeriNewProductErrorBoxHide");
    const [newProductSuccessBoxStyle, setNewProductSuccessBoxStyle] = useState("FermeriNewProductSuccessBoxHide");

    const imageHandler = async (eventi) => {
        if(eventi.target.files && eventi.target.files[0]){
            setImage(URL.createObjectURL(eventi.target.files[0]));
            const reader = new FileReader();
            reader.readAsDataURL(eventi.target.files[0]);
            reader.onload = async () => {
                setImageFile(reader.result);
            }
        }
    }

    const Publish = async () => {
        let txt = /\s/;
        let totalAccess = 0;
        let errora = 0;
        if(imageFile === ""){
            errora++;
        }else{
            totalAccess = totalAccess + 1;
        }
        if(newProductTitle.trim() === "" || newProductTitle.length > 50){
            setNewProductTitleStyle("FermeriNewProductTitleInputRED");
            errora++;
        }else{
            totalAccess = totalAccess + 1;
            setNewProductTitleStyle("FermeriNewProductTitleInput");
        }
        if(newProductPrice.trim() === "" || newProductPrice.length > 20){
            setNewProductPriceStyle("FermeriNewProductPriceInputRED");
            errora++;
        }else{
            totalAccess = totalAccess + 1;
            setNewProductPriceStyle("FermeriNewProductPriceInput");
        }
        if(newProductLocation.trim() === "" || newProductLocation.length > 15){
            setNewProductLocationStyle("FermeriNewProductLocationInputRED");
            errora++;
        }else{
            totalAccess = totalAccess + 1;
            setNewProductLocationStyle("FermeriNewProductLocationInput");
        }
        if(newProductDescription.trim() === "" || newProductDescription.length > 200){
            setNewProductDescriptionStyle("FermeriNewProductDescriptionInputRED");
            errora++;
        }else{
            totalAccess = totalAccess + 1;
            setNewProductDescriptionStyle("FermeriNewProductDescriptionInput");
        }
        
        if(errora !== 0){
            setNewProductErrorBoxStyle("FermeriNewProductErrorBox");
            setNewProductSuccessBoxStyle("FermeriNewProductSuccessBoxHide");
        }
        if(totalAccess === 5){
            let userLocal = JSON.parse(localStorage.getItem("FrafarmUser"));
            let apicall = await fetch("http://frafarm.herokuapp.com/Fermeri/Products/NewProduct",{
                method: "post",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "uid": userLocal.uid,
                    "tipiAccount": userLocal.tipiAccount,
                    "productImage": imageFile,
                    "productTitle": newProductTitle,
                    "productPrice": newProductPrice,
                    "productLocation": newProductLocation,
                    "productDescription": newProductDescription,
                })
            }).catch((error) => {
                setNewProductErrorBoxStyle("FermeriNewProductErrorBox");
                setNewProductSuccessBoxStyle("FermeriNewProductSuccessBoxHide");
            })
            let response = await apicall.json();
            if(response.success === true){
                setNewProductErrorBoxStyle("FermeriNewProductErrorBoxHide");
                setNewProductSuccessBoxStyle("FermeriNewProductSuccessBox");
                setImage(require("../Images/AddImage.png"));
                setNewProductTitle("");
                setNewProductPrice("");
                setNewProductLocation("");
                setNewProductDescription("");
            }else{
                setNewProductErrorBoxStyle("FermeriNewProductErrorBox");
                setNewProductSuccessBoxStyle("FermeriNewProductSuccessBoxHide");
            }
        }
    }

    return(
        <div className="FermeriNewProductBox">
            <div className="FermeriNewProductInputBox">
                <div className={newProductSuccessBoxStyle}>
                    <h5 className="FermeriNewProductSuccessText">Successfully published.</h5>
                    <img onClick={() => setNewProductSuccessBoxStyle("FermeriNewProductSuccessBoxHide")} className="FermeriNewProductSuccessButton" src={require("../Images/xButton.png")} alt="X"/>
                </div>
                <div className={newProductErrorBoxStyle}>
                    <h5 className="FermeriNewProductErrorText">Publishing failed.</h5>
                    <img onClick={() => setNewProductErrorBoxStyle("FermeriNewProductErrorBoxHide")} className="FermeriNewProductErrorButton" src={require("../Images/xButton.png")} alt="X"/>
                </div>
                <div className="FermeriNewProductPublicDataBox">
                    <div className="FermeriProductsItemBox">
                        <div className="FermeriProductsItemImgBox">
                            <input style={{display: "none"}} type="file" accept="image/*" onChange={(e) => imageHandler(e)} ref={fileInput => setImazhiInputRef(fileInput)} />
                            <img onClick={() => imazhiInputRef.click()} className="FermeriNewProductImage" src={image} alt="Select Image" />
                        </div>
                        <div className="FermeriProductsItemTextBox">
                            <h5 className="FermeriProductsItemText">Title: {newProductTitle}</h5>
                            <h5 className="FermeriProductsItemText">Price: {newProductPrice}</h5>
                            <h5 className="FermeriProductsItemText">Location: {newProductLocation}</h5>
                        </div>
                    </div>
                </div>
                <input className={newProductTitleStyle} value={newProductTitle} onChange={(e) => setNewProductTitle(e.target.value)} placeholder="Product Title..." />
                <input className={newProductPriceStyle} value={newProductPrice} onChange={(e) => setNewProductPrice(e.target.value)} placeholder="Product Price..." />
                <input className={newProductLocationStyle} value={newProductLocation} onChange={(e) => setNewProductLocation(e.target.value)} placeholder="Product Location..." />
                <textarea className={newProductDescriptionStyle} value={newProductDescription} onChange={(e) => setNewProductDescription(e.target.value)} placeholder="Product Description..." />
                <button type="button" onClick={() => Publish()} className="FermeriNewProductButton">Publish</button>
            </div>
        </div>
    );
}

export default FermeriNewProduct;