import React from "react";
import { connect } from "react-redux";

const LogoutButton = (props) => {

    const logout = () => {
        localStorage.clear();
        props.history.push("/");
    }

    return(
        <div>
        { props.ShowLogoutButton ?
            <h5 onClick={() => logout()} className="LogoutText">Logout</h5>
            : null
        }
        </div>
    );
}

function mapStatetoProps(state){
    return{
      ShowLogoutButton: state.ShowLogoutButton
    }
}

export default connect(mapStatetoProps,null)(LogoutButton);