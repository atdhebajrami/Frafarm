import React from "react";
import "./NotFound.css";

const NotFound = (props) => {
    return(
        <div className="NotFoundBox">
            <div className="NotFoundImageBox">
                <img className="NotFoundImage" src={require("../Images/NotFound.jpg")} alt="Not Found"/>
            </div>
            <div className="NotFoundContentBox">
                <button onClick={() => props.history.push("/")} className="NotFoundButton">Go to Homepage</button>
            </div>
        </div>
    );
}

export default NotFound;