import React, {useState, useEffect} from "react";
import { useParams } from 'react-router';
import axios from 'axios';
import Navbar from './Sidebar'
import "./styles.css"

function User(props) {
    const { id } = useParams();
    const [status, setStatus] = useState("")

    useEffect(() => {
        const axiosGetFriendStatus = async() => {
            await axios.get('http://localhost:4000/followStatus', {params: {user_id: props.user_id, friend_id: id}})
            .then(async res => {
                if (res) {
                    console.log("Current status", res.data)
                    setStatus(res.data)
                }
            })
            .catch(err => {
                console.log("Error getting friends", err)
            })
        }
        axiosGetFriendStatus()
    }, [])

    const friendUser = async () => {
        console.log("Friending", props.user.id, id, status)

        await axios.post('http://localhost:4000/changeFollowStatus', {params: {user_id: props.user_id, friend_id: id, status: status}})
        .then(async res => {
            if (res.data != "error") {
                console.log("Changed friend status to ", res.data)
                setStatus(res.data)
            }
        })
        .catch(err => {
            console.log("Error changing friend status", err)
        })
    }

    return (
        <div className="container">
            <div className="navbar">
                <Navbar />
            </div>
            <div className="content">
                <h1>{id}</h1>
                <button onClick={friendUser}>{status == "none" ? "Follow" : status == "following" ? "Unfollow" : "Requested"}</button>
            </div>
        </div>
    );
}

export default User;