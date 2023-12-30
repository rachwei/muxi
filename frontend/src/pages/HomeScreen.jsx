import React, {useState, useEffect} from "react";
import axios from 'axios';

import {Container, Form, FormControl, Image, ListGroup} from 'react-bootstrap'
import { Link } from 'react-router-dom'

import PopUp from "../components/PopUp"; 
import Review from '../components/Review'
import Navbar from '../components/Sidebar'

import "../static/styles.css"

function HomeScreen(props) {
    const [friendsList, setFriendsList] = useState([])
    const [seen, setSeen] = useState(false)
    const [reviewsList, setReviewsList] = useState([])
    const [posts, setPosts] = useState([])
    const [usersearch, setUserSearch] = useState([])

    useEffect(() => {
        const axiosGetFriends = async() => {
            await axios.get('http://localhost:4000/following', {params: {user_id: props.user_id}})
            .then(async res => {
                if (res) {
                    setFriendsList(res.data)

                    console.log("About to retrieve all reviews" + props.user_id)

                    await axios.get('http://localhost:4000/get-all-reviews', {params: {user_id: props.user_id}})
                    .then(reviews_result => {
                        if (reviews_result) {
                            setReviewsList(reviews_result.data)
                        }
                    })
                }
                console.log("Getting friends", res.data)
            })
            .catch(err => {
                console.log("Error getting friends", err)
            })
        }

        async function fetchData() {
            await axios.get('http://localhost:4000/songs')
            .then(async res => {
                console.log(res.data.data.songs)
                setUserSearch(res.data.data.songs)
            })
            .catch(err => {
                console.log("Error fetching all the songs", err)
            })

            await axios.get('http://localhost:4000/usersearch')
            .then(async res => {
                console.log(res.data.data.users)
                setUserSearch(res.data.data.users)
            })
            .catch(err => {
                console.log("Error fetching all the users from search", err)
            })
        }

        axiosGetFriends()
        fetchData()
    }, [])

    const searchPost = async (e) => {
        console.log("In the search post!")
        const searchValue = e.target.value
        await axios.get('http://localhost:4000/songs',{params: {searchQuery: searchValue}})
        .then(async res => {
            console.log(res.data.data.songs)
            setPosts(res.data.data.songs)
        })
        .catch(err => {
            console.log("Error getting query", err)
        })
    }

    const searchUser = async (e) => {
        console.log("In the user post!")
        const searchValue = e.target.value
        await axios.get('http://localhost:4000/usersearch',{params: {searchQuery: searchValue}})
        .then(async res => {
            console.log(res.data.data.users)
            setPosts(res.data.data.users)
        })
        .catch(err => {
            console.log("Error getting query", err)
        })
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
                    <h2 className="text-center">Welcome to Muxi!</h2>
                    <Form>
                        <FormControl
                            type="search"
                            placeholder="Search"
                            className="me-5"
                            aria-label="Search"
                            onChange={searchPost} // onChange will trigger "search post"
                        />
                    </Form>
                    <ListGroup variant="flush" as="ol">
                        {posts.map((post) => {
                            return (
                            <ListGroup.Item key={post._id}>
                                <div className="fw-bold h3">
                                <Link to={`/song/${post._id}`} style={{ textDecoration: 'none' }}>
                                    {post.name}
                                </Link>
                                </div>
                            </ListGroup.Item>
                            )
                        })}
                    </ListGroup>

                    <h2 className="text-center">People</h2>
                    <Form>
                    <FormControl
                        type="search"
                        placeholder="Search"
                        className="me-5"
                        aria-label="Search"
                        onChange={searchUser} // onChange will trigger "search post"
                    />
                    </Form>
                    <ListGroup variant="flush" as="ol">
                        {usersearch.map((user) => {
                            return (
                            <ListGroup.Item key={user._id}>
                                <div className="fw-bold h3">
                                <Link to={`/user/${user._id}`} style={{ textDecoration: 'none' }}>
                                    {user.name}
                                </Link>
                                </div>
                            </ListGroup.Item>
                            )
                        })}
                    </ListGroup>

                <h1>hey</h1>
                <p>hi {props.user.display_name}</p>
                <p>Friends:</p>
                {friendsList && friendsList.map((friend, i) => (
                    <div key={i}>{friend}</div>
                ))}
                <div className="btn" onClick={togglePop}>
                    <button>Add Review</button>
                </div>
                <p>Friends reviews:</p>
                {}
                {reviewsList && reviewsList.map((review, i) => (
                    <Review key={i} review={review} user_id={props.user_id}/>
                ))}
                {seen ? <PopUp toggle={togglePop} user_id={props.user_id}/> : null}
            </div>
        </div>
    );
}

export default HomeScreen;