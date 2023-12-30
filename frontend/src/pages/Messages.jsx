import React, {useState, useEffect} from "react";
import Navbar from '../components/Sidebar'

import {Container, Form, FormControl, Image, ListGroup} from 'react-bootstrap'
import { Link } from 'react-router-dom'


import "../static/styles.css"

import axios from 'axios';


function Messages(props) {
    const [convos, setConvos] = useState([]);
    const [id, setId] = useState("");
    const user_id = props.user_id

    const fetchNewConvos = async () => {
        try {
            const response = await axios.get('http://localhost:4000/getConvos', {
                params: { user_id: props.user_id }
            });

            if (response.data.length > 0) {
                setConvos(response.data);
            }
        } catch (err) {
            console.log("Error fetching new messages", err);
        }
    };

    const createConvo = async (event) => {
        event.preventDefault();
        if (id.trim() === "") {
            alert("Enter valid message");
            return;
        }

        try {
            const res = await axios.post('http://localhost:4000/createConvo', { 
                params: { sender_id: props.user_id, receiver_id: id }})
            console.log(`Created chat from ${user_id} to ${id}`);
        } catch (err) {
            console.log("Error creating chat", err);
        }
        setId("");
    };

    useEffect(() => {
        fetchNewConvos()
        const intervalId = setInterval(fetchNewConvos, 8000); // Fetch every 5 seconds
        return () => clearInterval(intervalId); // Cleanup on component unmount
    }, []);
    
    return (
        <div className="container">
            <div className="navbar">
                <Navbar />
            </div>
            <div className="content">
                <h1>this is messages page</h1>
                <form onSubmit={(event) => createConvo(event)} className="send-message">
                    <label htmlFor="messageInput" hidden>
                        Enter id
                    </label>
                    <input
                        id="messageInput"
                        name="messageInput"
                        type="text"
                        className="form-input__input"
                        placeholder="type message..."
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                    />
                    <button type="submit">Add new chat</button>
                </form>
                <ListGroup variant="flush" as="ol">
                    {convos.map((convo) => {
                        return (
                            <ListGroup.Item key={convo._id}>
                                <div className="fw-bold h3">
                                <Link to={`/convo/${convo._id}`} style={{ textDecoration: 'none' }}>
                                    {convo.p1 == user_id ? convo.p2 : convo.p1}
                                </Link>
                                </div>
                            </ListGroup.Item>
                        )
                    })}
                </ListGroup>
            </div>
        </div>
    );
}

export default Messages;