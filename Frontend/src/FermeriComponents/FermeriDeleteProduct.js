import React, { useState, useEffect } from "react";
import "./FermeriDeleteProduct.css";

const FermeriDeleteProduct = (props) => {
    const [title , setTitle] = useState("");

    useEffect(() => {
        let product = JSON.parse(localStorage.getItem("FermeriDeleteProduct"));
        if(product !== null){
            setTitle(product.title);
        }else{
            props.history.goBack();
        }
    })

    const Delete = async () => {
        let userLocal = JSON.parse(localStorage.getItem("FrafarmUser"));
        let product = JSON.parse(localStorage.getItem("FermeriDeleteProduct"));
        let apicall = await fetch("http://frafarm.herokuapp.com/Fermeri/Products/DeleteProduct",{
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "uid": userLocal.uid,
                "productID": product.id,
                "productImagePublicID": product.imagePublicID,
            })
        })
        let response = await apicall.json();
        if(response.success === true){
            localStorage.removeItem("FermeriDeleteProduct");
            props.history.goBack();
        }
    }

    return(
        <div className="FermeriDeleteProductBox">
            <div className="FermeriDeleteProductContentBox">
                <div className="FermeriDeleteProductConfirmTextBox">
                    <h5 className="FermeriDeleteProductText">Are you sure you want to delete {title} ?</h5>
                </div>
                <div className="FermeriDeleteProductButtonBox">
                    <button onClick={() => props.history.goBack()} className="FermeriDeleteProductCancelButton">Cancel</button>
                    <button onClick={() => Delete()} className="FermeriDeleteProductYesButton">Yes</button>
                </div>
            </div>
        </div>
    );
}

export default FermeriDeleteProduct;