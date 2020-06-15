import React, { useEffect, useState } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import FermeriMenu from "../FermeriComponents/FermeriMenu";
import FermeriProducts from "../FermeriComponents/FermeriProducts";
import FermeriOrders from "../FermeriComponents/FermeriOrders";
import FermeriProfile from "../FermeriComponents/FermeriProfile";
import FermeriNewProduct from "../FermeriComponents/FermeriNewProduct";
import FermeriEditProduct from "../FermeriComponents/FermeriEditProduct";
import FermeriDeleteProduct from "../FermeriComponents/FermeriDeleteProduct";
import NotFound from "./NotFound";

const FermeriPages = (props) => {
    const [auth, setAuth] = useState(true);
    const [redirectPath, setRedirectPath] = useState(null);

    useEffect(() => {
        props.UpdateLogoutButton("Show");
        Start();

    }, [props.location.pathname])

    const Start = async () => {
        let user = JSON.parse(localStorage.getItem("FrafarmUser"));
        if(user !== null){
            if(user.tipiAccount === "Blersi"){
                setAuth(false);
                setRedirectPath("/Blersi");
            }
            if(user.tipiAccount === "Fermeri"){
                let verify = await VerifyUser(user.uid, user.tipiAccount);
                if(verify === true){
                    setAuth(true);
                }else{
                    localStorage.removeItem("FrafarmUser");
                    setAuth(false);
                    setRedirectPath("/");
                }
            }
        }else{
            setAuth(false);
            setRedirectPath("/");
        }
    }

    const VerifyUser = async (uid,tipiAccount) => {
        let apicall = await fetch("http://frafarm.herokuapp.com/VerifyUser",{
            method: "post",
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                "uid": uid,
                "tipiAccount": tipiAccount
            })
        })
        let response = await apicall.json();
        if(response.success === true){
            return true;
        }else{
            return false;
        }
    }

    return (
        <div>
            {
            auth ?
            <Switch>
                <Route exact path="/Fermeri/Products/DeleteProduct" component={FermeriDeleteProduct} />
                <Route exact path="/Fermeri/Products/EditProduct" component={FermeriEditProduct} />
                <Route exact path="/Fermeri/Products/NewProduct" component={FermeriNewProduct} />
                <Route exact path="/Fermeri/Profile" component={FermeriProfile} />
                <Route exact path="/Fermeri/Orders" component={FermeriOrders} />
                <Route exact path="/Fermeri/Products" component={FermeriProducts} />
                <Route exact path="/Fermeri/" component={FermeriMenu} />
                <Route component={NotFound} />
            </Switch>
            : <Redirect to={redirectPath} />
            }
        </div>
    );
}

function mapDispatchtoProps(dispatch){
    return{
        UpdateLogoutButton: (newValue) => {dispatch({type: newValue})}
    }
}

export default connect(null,mapDispatchtoProps)(FermeriPages);