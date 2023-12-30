import React, {useState, useEffect} from "react";
import { useParams } from 'react-router';
import axios from 'axios';
import Navbar from '../components/Sidebar'

import {Container, Form, FormControl, Image, ListGroup} from 'react-bootstrap'


const Convo = (props) => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [lastMessageId, setLastMessageId] = useState("");
    const {convo_id} = useParams()
    const sender_id = props.user_id
    
    const sendMessage = async (event) => {
        event.preventDefault();
        if (message.trim() === "") {
            alert("Enter valid message");
            return;
        }

        try {
            console.log("About to send message!", convo_id)
            const res = await axios.post('http://localhost:4000/sendMessage', { 
                params: { sender_id: sender_id, convo_id: convo_id, content: message }})
            console.log(`Sent message from ${sender_id}`);
        } catch (err) {
            console.log("Error sending message", err);
        }
        setMessage("");
    };


    const fetchNewMessages = async () => {
        try {
            console.log("old", lastMessageId)
            const response = await axios.get('http://localhost:4000/getNewMessages', {
                params: { convo_id: convo_id, last_message_id: lastMessageId }
            });
            console.log(response)
            if (response.data.messages.length > 0) {
                console.log(response.data.latest)
                setMessages([...messages, ...response.data.messages]);
                setLastMessageId(response.data.latest);
            }
        } catch (err) {
            console.log("Error fetching new messages", err);
        }
    };


    useEffect(() => {
        fetchNewMessages()
        const intervalId = setInterval(fetchNewMessages, 8000); // Fetch every 5 seconds
        return () => clearInterval(intervalId); // Cleanup on component unmount
    }, []);

    return (
        <div className="container">
            <div className="navbar">
                <Navbar />
            </div>
            <div className="content">
            <form onSubmit={(event) => sendMessage(event)} className="send-message">
                <label htmlFor="messageInput" hidden>
                    Enter Message
                </label>
                <input
                    id="messageInput"
                    name="messageInput"
                    type="text"
                    className="form-input__input"
                    placeholder="type message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button type="submit">Send</button>
                <ListGroup variant="flush" as="ol">
                        {messages.map((message) => {
                            return (
                                <ListGroup.Item key={message._id}>
                                    <div className="fw-bold h3">
                                        {message.content}
                                    </div>
                                </ListGroup.Item>
                            )
                        })}
                    </ListGroup>
            </form>
        </div>
        </div>
    );
};
export default Convo;