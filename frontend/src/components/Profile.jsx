import React, {useState, useEffect} from "react";
import Navbar from './Sidebar'

import "./styles.css"

function Profile(props) {
    const { user, user_id } = props;
  
    return (
      <div className="container">
        <div className="navbar">
          <Navbar />
        </div>
        <div className="content">
          <h1>hi {user && user.display_name}</h1>
        </div>
      </div>
    );
  }

export default Profile;