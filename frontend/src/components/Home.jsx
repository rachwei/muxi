import React, {useState, useEffect} from "react";
import SpotifyWebApi from 'spotify-web-api-js'
import axios from 'axios';
import {loginUrl, getTokenFromUrl} from "../spotify"

import HomeScreen from "./HomeScreen"

const spotify = new SpotifyWebApi();

function Home(props) {
    // const [user, setUser] = props.
    const {user, setUser, user_id, setUserId, signout} = props
    
    useEffect(() => {
        const loggedInUser_id = localStorage.getItem("user_id");
        const loggedInUser = localStorage.getItem("user");

        if (signout) {
            setUser({})
            setUserId("")
            localStorage.clear();

        } else if (loggedInUser) {
            const foundUser = JSON.parse(loggedInUser);
            setUser(foundUser)
            setUserId(loggedInUser_id)
            
        } else {
            // console.log("This is what we derived from the URL: ", getTokenFromUrl());
            const _spotifyToken = getTokenFromUrl().access_token;
            window.location.hash = ""
    
            if (_spotifyToken) {
                spotify.setAccessToken(_spotifyToken);
    
                spotify.getMe().then((user) => {
                    // console.log("THIS YOU: ", user)
                    const display_name = user.display_name
                    const user_id = user.id
                    const images = user.images
                    setUser(user)
                    localStorage.setItem('user', JSON.stringify(user) )
    
                    const axiosFetchData = async() => {
                        await axios.post('http://localhost:4000/users', {
                            params: {
                                name: display_name,
                                user_id: user_id,
                                images: images
                            }
                        })
                        .then(res => {
                            setUserId(res.data)
                            localStorage.setItem('user_id', res.data)
                        })
                        .catch(err => {
                            console.log("Error", err)
                        })
                    }
                    axiosFetchData()
                });
            }
        }
    }, [])
    return (
        <div>
        {user.id && user_id && !signout ? (
            <HomeScreen user={user} user_id={user_id}/>
        ) : (
            <a href={loginUrl} id="signInButton">Sign in with spotify!</a>
        )}
        </div>
    );
    }

export default Home;