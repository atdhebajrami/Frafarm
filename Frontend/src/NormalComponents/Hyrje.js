import React, { useEffect, useState } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import Homepage from "./Homepage";
import Login from "./Login";
import Signup from "./Signup";
import ForgotPassword from "./ForgotPassword";
import NotFound from "./NotFound";

const Hyrje = (props) => {
    const [auth, setAuth] = useState(false);
    const [redirectPath, setRedirectPath] = useState(null);

    useEffect(() => {
        props.UpdateLogoutButton("Hide");
        let user = JSON.parse(localStorage.getItem("FrafarmUser"));
        if(user !== null){
            setAuth(true);
            setRedirectPath("/" + user.tipiAccount);
        }else{
            setAuth(false);
        }

    }, [props.location.pathname])

    return (
        <div>
        {
        auth ? (<Redirect to={redirectPath} />)
        :
        <Switch>
            <Route exact path="/Login" component={Login} />
            <Route exact path="/Signup" component={Signup} />
            <Route exact path="/ForgotPassword" component={ForgotPassword} />
            <Route exact path="/" component={Homepage} />
            <Route component={NotFound} />
        </Switch>
        }
        </div>
    );
}

function mapDispatchtoProps(dispatch){
    return{
        UpdateLogoutButton: (newValue) => {dispatch({type: newValue})}
    }
}

export default connect(null,mapDispatchtoProps)(Hyrje);