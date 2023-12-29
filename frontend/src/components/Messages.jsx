import React, {useState, useEffect} from "react";
import Navbar from './Sidebar'
import "./styles.css"


function Messages(props) {
    
    return (
        <div className="container">
            <div className="navbar">
                <Navbar />
            </div>
            <div className="content">
            <h1>this is messages page</h1>
            </div>
        </div>
    );
}

export default Messages;