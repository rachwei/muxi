import React, {useState, useEffect} from "react";
import Navbar from '../components/Sidebar'
import "../static/styles.css"

import {ListGroup} from 'react-bootstrap'
import { Link } from 'react-router-dom'

import axios from 'axios';

function Notifications(props) {
    const [recs, setRecs] = useState([])

    useEffect(() => {
        const axiosGetRecommendations = async() => {
            await axios.get('http://localhost:4000/getRecommendations', {params: {user_id: props.user_id}})
            .then(async res => {
                if (res) {
                    console.log("got back", res)
                    setRecs(res.data)
                }
            })
            .catch(err => {
                console.log("Error getting requests", err)
            })
        }
        axiosGetRecommendations()
    }, [])
    
    return (
        <div className="container">
            <div className="navbar">
                <Navbar />
            </div>
            <div className="content">
            <ListGroup variant="flush" as="ol">
                        {recs.map((rec) => {
                            return (
                            <ListGroup.Item key={rec}>
                                <div className="fw-bold h3">
                                <Link to={`/song/${rec}`} style={{ textDecoration: 'none' }}>
                                    {rec}
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

export default Notifications;