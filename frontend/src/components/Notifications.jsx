import React, {useState, useEffect} from "react";
import Navbar from './Sidebar'
import "./styles.css"

import axios from 'axios';

function Notifications(props) {
    const [requests, setRequests] = useState([])

    const handleAccept = async(followRequest) => {
        await axios.post('http://localhost:4000/acceptRequest', {params: {request: followRequest}})
            .then(async res => {
                if (res) {
                    console.log(`Accepted follow request from ID ${followRequest.requester}`);
                }
            })
            .catch(err => {
                console.log("Error accepting friend request", err)
            })
    };
    
    const handleReject = async(followRequest) => {
        await axios.post('http://localhost:4000/rejectRequest', {params: {request: followRequest}})
        .then(async res => {
            if (res != "error") {
                console.log(`Rejected follow request from ID ${followRequest.requester}`);
            }
        })
        .catch(err => {
            console.log("Error rejecting friend request", err)
        })
    };

    useEffect(() => {
        const axiosGetfollowRequests = async() => {
            await axios.get('http://localhost:4000/getRequests', {params: {user_id: props.user_id}})
            .then(async res => {
                if (res) {
                    setRequests(res.data)
                }
            })
            .catch(err => {
                console.log("Error getting requests", err)
            })
        }
        axiosGetfollowRequests()
    }, [])

    const FollowRequest = ({ followRequest, onAccept, onReject }) => {
        console.log("follow request:")
        console.log(followRequest)
        return (
          <div>
            <p>{followRequest.requester}</p>
            <button onClick={() => onAccept(followRequest)}>Accept</button>
            <button onClick={() => onReject(followRequest)}>Reject</button>
          </div>
        );
    };  
    
    return (
        <div className="container">
            <div className="navbar">
                <Navbar />
            </div>
            <div className="content">
            {requests.map((request) => (
                <FollowRequest
                key={request.requester}
                followRequest={request}
                onAccept={handleAccept}
                onReject={handleReject}
                />
            ))}
            </div>
        </div>
    );
}

export default Notifications;