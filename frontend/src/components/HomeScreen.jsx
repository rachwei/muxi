import React, {useState, useEffect} from "react";
import axios from 'axios';


function HomeScreen(props) {
    const [friendsList, setFriendsList] = useState([])

    useEffect(() => {
        const axiosGetFriends = async() => {
            const spotify_id = props.user.id
            await axios.get('http://localhost:4000/friends', {
                params: {
                    spotify_id: spotify_id
                }
            })
            .then(res => {
                if (res) {
                    setFriendsList(res.data)
                }
                console.log("Getting friends", res.data)
            })
            .catch(err => {
                console.log("Error getting friends", err)
            })
        }
        axiosGetFriends()
    }, [])

    return (
        <div>
            <p>hi {props.user.display_name}</p>
            {friendsList && friendsList.map((friend, i) => (
                <div key={i}>{friend}</div>
            ))}
        </div>
    );
}

export default HomeScreen;