import React from "react";
import { useState, useEffect } from "react";
import "./FermeriProducts.css";
import FermeriProductsItem from "./FermeriProductsItem";

const FermeriProducts = (props) => {
    const [productName, setProductName] = useState("");
    const [locationName, setLocationName] = useState("");
    const [newold, setNewOld] = useState("Newest");
    const [lista, setLista] = useState([]);
    const [listaKaItem, setListaKaItem] = useState(false);
    const [newestButtonStyle, setNewestButtonStyle] = useState("NewestButtonSelected");
    const [oldestButtonStyle, setOldestButtonStyle] = useState("OldestButtonUnSelected");

    useEffect(() => {
        search();
    }, [])

    const search = async () => {
        let userLocal = JSON.parse(localStorage.getItem("FrafarmUser"));
        let apicall = await fetch("http://frafarm.herokuapp.com/Fermeri/Products",{
            method: "post",
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                "uid": userLocal.uid,
                "tipiAccount": userLocal.tipiAccount,
                "title": productName,
                "location": locationName,
                "newold": newold
            })
        })
        let response = await apicall.json();
        if(response.success === true){
            setLista(response.lista);
            if(response.lista.length >= 1){
                setListaKaItem(true);
            }
        }
    }

    const changeType = (type) => {
        if(type === "newest"){
            setNewestButtonStyle("NewestButtonSelected");
            setOldestButtonStyle("OldestButtonUnSelected");
            setNewOld("Newest");
        }
        if(type === "oldest"){
            setNewestButtonStyle("NewestButtonUnSelected");
            setOldestButtonStyle("OldestButtonSelected");
            setNewOld("Oldest");
        }
    }

    return(
        <div className="FermeriProductsBox">
            <div className="FermeriProductsInputBox">
                <input className="FermeriProductsProductName" type="text" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="Search by Product"/>
                <input className="FermeriProductsLocationName" type="text" value={locationName} onChange={(e) => setLocationName(e.target.value)} placeholder="Search by Location"/>
                <div className="FermeriProductsCheapExpeBox">
                    <button onClick={() => changeType("newest")} className={newestButtonStyle}>Newest</button>
                    <button onClick={() => changeType("oldest")} className={oldestButtonStyle}>Oldest</button>
                </div>
                <button className="FermeriProductsSearchButton" type="submit" onClick={() => search()}>Search</button>
                <h5 className="FermeriProductsTitle">Products</h5>
            </div>
            <div className="FermeriProductsDisplayBox">
                <div className="FermeriProductsNewButtonBox">
                    <button onClick={() => props.history.push("/Fermeri/Products/NewProduct")} className="FermeriProductsNewButton">+ New</button>
                </div>
                {
                    listaKaItem ?
                    lista.map((item,i) =>{
                        return(
                        <FermeriProductsItem key={i} productData={item} history={props.history} />
                        );
                      })
                      : null
                }
            </div>
        </div>
    );
}

export default FermeriProducts;