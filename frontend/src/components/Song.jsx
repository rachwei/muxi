import React, {useState, useEffect} from "react";
import { useParams } from 'react-router';
import axios from 'axios';
import Navbar from './Sidebar'
import PopUp from './PopUp'
import "./styles.css"

function Song(props) {
    const { id } = useParams();
    const [songInfo, setSongInfo] = useState({})
    const [seen, setSeen] = useState(false)

    useEffect(() => {
        const axiosGetSongInfo = async() => {
            await axios.get('http://localhost:4000/getSongInfo', {params: {song_id: id}})
            .then(async res => {
                if (res) {
                    setSongInfo(res.data)
                }
            })
            .catch(err => {
                console.log("Error getting song info", err)
            })
        }
        axiosGetSongInfo()
    }, [])

    const rateSong = async () => {
        // console.log("Friending", props.user.id, id, status)

        // await axios.post('http://localhost:4000/changeFollowStatus', {params: {user_id: props.user_id, friend_id: id, status: status}})
        // .then(async res => {
        //     if (res.data != "error") {
        //         console.log("Changed friend status to ", res.data)
        //         setStatus(res.data)
        //     }
        // })
        // .catch(err => {
        //     console.log("Error changing friend status", err)
        // })
    }

    const togglePop = () => {
        setSeen(!seen)
    };

    return (
        <div className="container">
            <div className="navbar">
                <Navbar />
            </div>
            <div className="content">
                <h1>{id}</h1>
                <h3>{songInfo ? songInfo.name : "Loading"}</h3>
                <div className="btn" onClick={togglePop}>
                    <button>Add Review</button>
                </div>
                {seen ? <PopUp toggle={togglePop} user_id={props.user_id}/> : null}
            </div>
        </div>
    );
}

export default Song;