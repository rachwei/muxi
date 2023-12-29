import React, {useState, useEffect} from "react";
import axios from 'axios';

import '../index.css'


function PopUp(props) {
    const [songId, setSongId] = useState('');
    const [rating, setRating] = useState(0);
    const [message, setMessage] = useState('');

    const handleClick = () => {
        props.toggle()
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const axiosGetFriends = async() => {
            await axios.post('http://localhost:4000/post-review', {
                params: {
                    user_id: props.user_id,
                    message: message,
                    song_id: songId,
                    rating: rating
                }
            })
            .then(res => {
                console.log("Submitted a review with response:", res.data)
                alert('You have submitted a review!');
                handleClick();
            })
            .catch(err => {
                console.log("Error submitting a response", err)
                alert('Failure to submit review!');
            })
        }
        axiosGetFriends()
    }
    
    return (
        <div className="modal">
            <div className="modal_content">
                <span className="close" onClick={handleClick}>&times;</span>
                <p>Leave a Review</p>
                <form className='form' onSubmit={handleSubmit}>
                    <div className='form-control'>
                        <label htmlFor='songId'>Song Id:</label>
                        <input
                            type='text' id='songId' name='songId' value={songId}
                            onChange={(e) => setSongId(e.target.value)}
                        />
                        <label htmlFor='rating'>Rating:</label>
                        <input
                            type='text' id='rating' name='rating' value={rating}
                            onChange={(e) => setRating(e.target.value)}
                        />
                        <label htmlFor='message'>Message:</label>
                        <input
                            type='text' id='' name='message' value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                    </div>
                    <button type='submit'>Submit Review</button>
                </form>
            </div>
        </div>
    );
}

export default PopUp;