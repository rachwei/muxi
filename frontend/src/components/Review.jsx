import React, {useState, useEffect} from "react";
import axios from 'axios';

function Review(props) {
    const review = props.review

    const handleLike = (e) => {
        e.preventDefault();

        const axiosLikePost = async() => {
            await axios.post('http://localhost:4000/like-review', {
                params: {
                    user_id: props.user_id,
                    review_id: review._id
                }
            })
            .then(res => {
                console.log("Liked review:", res.data)
            })
            .catch(err => {
                console.log("Error submitting a response", err)
            })
        }
        axiosLikePost()
    }
    
    return (
        <div className="review-card">
            <h3>{review.user_id} ranked {review.song_id}</h3>
            <div>Rating: {review.rating}</div>
            <p>Message: {review.message}</p>
            <p>Like count: {review.likes.length}</p>
            <p>Comment count: {review.comments.length}</p>
            <p>Entry date: {review.entryDate}</p>
            <button onClick={handleLike}>Like</button>
            <button>Comment</button>
        </div>
    );
}

export default Review;