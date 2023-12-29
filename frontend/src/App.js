import logo from './logo.svg';
import './App.css';

import React, {useState} from 'react';

import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

import Home from "./components/Home"
import Profile from './components/Profile'
import Messages from './components/Messages'
import User from './components/User'
import Notifications from './components/Notifications'
import Song from './components/Song'

function App() {
  const [user, setUser] = useState({})
  const [user_id, setUserId] = useState("")
  
  return (
    <div className="App">
      <header className="App-header">
        <Routes>
          <Route path="/" element={<Home user={user} setUser={setUser} user_id={user_id} setUserId={setUserId} signout={false}/>} />
          <Route path="/messages" element={user && user_id ? <Messages user={user} user_id={user_id}/> : <Home user={user} setUser={setUser} user_id={user_id} setUserId={setUserId} signout={false}/>} />
          <Route path="/signout" element={<Home user={user} setUser={setUser} user_id={user_id} setUserId={setUserId} signout={true}/>} />
          <Route path="/profile" element={user && user_id ? <Profile user={user} user_id={user_id}/> : <Home user={user} setUser={setUser} user_id={user_id} setUserId={setUserId} signout={false}/>} />
          <Route path="/user/:id" element={user && user_id ? <User user={user} user_id={user_id}/> : <Home user={user} setUser={setUser} user_id={user_id} setUserId={setUserId} signout={false}/>}/>
          <Route path="/notifications" element={user && user_id ? <Notifications user={user} user_id={user_id}/> : <Home user={user} setUser={setUser} user_id={user_id} setUserId={setUserId} signout={false}/>} />
          <Route path="/song/:id" element={user && user_id ? <Song user={user} user_id={user_id}/> : <Home user={user} setUser={setUser} user_id={user_id} setUserId={setUserId} signout={false}/>} />
        </Routes>
      </header>
    </div>
  );
}

export default App;
