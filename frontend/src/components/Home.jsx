import React, {useState, useEffect} from "react";
import SpotifyWebApi from 'spotify-web-api-js'
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

    console.log("THIS IS OUR SPOTIFY TOKEN", _spotifyToken)

    if (_spotifyToken) {
        setSpotifyToken(_spotifyToken)
        spotify.setAccessToken(_spotifyToken);

        spotify.getMe().then((user) => {
            console.log("THIS YOU: ", user)
            setUser(user)
        });
    }
    })
    return (
        <div>
        {specifyToken ? (
            <HomeScreen user={user} />
        ) : (
            <a href={loginUrl} id="signInButton">Sign in with spotify!</a>
        )}
        </div>
    );
    }

export default Home;