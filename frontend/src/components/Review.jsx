import React, {useState, useEffect} from "react";
import axios from 'axios';

function Review(props) {
    const review = props.review
    const [comment, setComment] = useState('');

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

    const handleComment = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:4000/commentOnReview', {
                params: {
                    user_id: props.user_id,
                    review_id: review._id,
                    comment: comment
                }
            });
            console.log("Commented on review:", response.data);
            setComment('')
            // update ui in the future to reflect??
        } catch (error) {
            console.log("Error submitting a comment", error);
        }
    };
    
    return (
        <div className="review-card">
            <h3>{review.user_id} ranked {review.song_id}</h3>
            <div>Rating: {review.rating}</div>
            <p>Message: {review.message}</p>
            <p>Like count: {review.likes.length}</p>
            <p>Comment count: {review.comments.length}</p>
            <p>Entry date: {review.entryDate}</p>
            <button onClick={handleLike}>Like</button>
            <form onSubmit={handleComment}>
                <label>
                    Comment:
                    <input
                        type="text"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                </label>
                <button type="submit">Comment</button>
            </form>
        </div>
    );
}

export default Review;