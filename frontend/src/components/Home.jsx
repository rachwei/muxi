import React, {useState, useEffect} from "react";
import SpotifyWebApi from 'spotify-web-api-js'
import axios from 'axios';
import {loginUrl, getTokenFromUrl} from "../spotify"

import HomeScreen from "./HomeScreen"

const spotify = new SpotifyWebApi();

function Home() {
    const [specifyToken, setSpotifyToken] = useState("")
    const [user, setUser] = useState({})

    useEffect(() => {
        console.log("This is what we derived from the URL: ", getTokenFromUrl());
        const _spotifyToken = getTokenFromUrl().access_token;
        window.location.hash = ""

        if (_spotifyToken) {
            setSpotifyToken(_spotifyToken)
            spotify.setAccessToken(_spotifyToken);

            spotify.getMe().then((user) => {
                console.log("THIS YOU: ", user)
                const display_name = user.display_name
                const user_id = user.id
                const images = user.images
                setUser(user)

                const axiosFetchData = async() => {
                    await axios.post('http://localhost:4000/users', {
                        params: {
                            name: display_name,
                            spotify_id: user_id,
                            images: images
                        }
                    })
                    .then(res => {
                        console.log("Get user result!", res)
                    })
                    .catch(err => {
                        console.log("Error", err)
                    })
                }
                axiosFetchData()
            });
        }
    }, [])
    return (
        <div>
        {specifyToken && user.id ? (
            <HomeScreen user={user}/>
        ) : (
            <a href={loginUrl} id="signInButton">Sign in with spotify!</a>
        )}
        </div>
    );
    }

export default Home;