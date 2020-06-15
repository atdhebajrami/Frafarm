import React from "react";
import '../App.css';

const Homepage = () =>{

    return(
        <div className="Homepage">
            <h5 className="Slogan">From farmers to you.</h5>
            <img className="Farmer" src={require("../Images/farmer.jpg")} alt="Farmer"/>
            <h5 className="Slogan">Why us ?</h5>
            <h5 className="SloganText">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</h5>
        </div>
    );
}

export default Homepage;