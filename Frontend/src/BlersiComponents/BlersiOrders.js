import React from "react";
import { useState, useEffect } from "react";
import "./BlersiOrders.css";
import BlersiOrdersItem from "./BlersiOrdersItem";

const BlersiOrders = (props) => {
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
        let apicall = await fetch("http://frafarm.herokuapp.com/Blersi/Orders",{
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
        <div className="BlersiOrdersBox">
            <div className="BlersiOrdersInputBox">
                <input className="BlersiOrdersProductName" type="text" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="Search by Product"/>
                <input className="BlersiOrdersLocationName" type="text" value={locationName} onChange={(e) => setLocationName(e.target.value)} placeholder="Search by Location"/>
                <div className="BlersiOrdersNewOldBox">
                    <button onClick={() => changeType("newest")} className={newestButtonStyle}>Newest</button>
                    <button onClick={() => changeType("oldest")} className={oldestButtonStyle}>Oldest</button>
                </div>
                <button className="BlersiOrdersSearchButton" type="submit" onClick={() => search()}>Search</button>
                <h5 className="BlersiOrdersTitle">Orders</h5>
            </div>
            <div className="BlersiOrdersDisplayBox">
            {
            listaKaItem ?
            lista.map((item,i) =>{
                return(
                <BlersiOrdersItem key={i} productData={item} history={props.history} />
                );
            })
            : null
            }
            </div>
        </div>
    );
}

export default BlersiOrders;