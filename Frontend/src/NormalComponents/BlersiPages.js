import React from "react";
import { useEffect, useState } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import BlersiMenu from "../BlersiComponents/BlersiMenu";
import BlersiProducts from "../BlersiComponents/BlersiProducts";
import BlersiOrders from "../BlersiComponents/BlersiOrders";
import BlersiProfile from "../BlersiComponents/BlersiProfile";
import BlersiProductsDetails from "../BlersiComponents/BlersiProductsDetails";
import BlersiOrdersDetails from "../BlersiComponents/BlersiOrdersDetails";
import NotFound from "./NotFound"

const BlersiPages = (props) => {
    const [auth, setAuth] = useState(true);
    const [redirectPath, setRedirectPath] = useState(null);

    useEffect(() => {
        props.UpdateLogoutButton("Show");
        Start();

    }, [props.location.pathname])

    const Start = async () => {
        let user = JSON.parse(localStorage.getItem("FrafarmUser"));
        if(user !== null){
            if(user.tipiAccount === "Fermeri"){
                setAuth(false);
                setRedirectPath("/Fermeri");
            }
            if(user.tipiAccount === "Blersi"){
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
                <Route exact path="/Blersi/Orders/Details" component={BlersiOrdersDetails} />
                <Route exact path="/Blersi/Products/Details" component={BlersiProductsDetails} />
                <Route exact path="/Blersi/Profile" component={BlersiProfile} />
                <Route exact path="/Blersi/Orders" component={BlersiOrders} />
                <Route exact path="/Blersi/Products" component={BlersiProducts} />
                <Route exact path="/Blersi/" component={BlersiMenu} />
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

export default connect(null,mapDispatchtoProps)(BlersiPages);