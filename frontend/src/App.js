import logo from './logo.svg';
import './App.css';

import React from 'react';

import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

import Home from "./components/Home"

function App() {

  return (
    <div className="App">
      <header className="App-header">
        <Routes>
          <Route path="/" element={<Home/>} />
        </Routes>
      </header>
    </div>
  );
}

export default App;
