const express = require('express')
const router = express.Router()
const schemas = require('../models/schemas')

router.post('/users', async(req, res) => {
    const {name, spotify_id, images} = req.body.params
    const doesUserExist = await schemas.Users.findOne({ spotify_id: spotify_id }).select("_id").lean();

    if (doesUserExist) {
        res.send(doesUserExist._id)

    } else {
        const userData = {
            name: name,
            spotify_id: spotify_id,
            images: images
        }

        const newUser = new schemas.Users(userData)
        const saveUser = await newUser.save()

        if (saveUser) {
            res.send(saveUser._id)
        } else {
            res.send("Failure when adding user to the database")
        }
    }
})

router.get('/friends', async(req, res) => {
    const {spotify_id} = req.query
    const user = await schemas.Users.findOne({ spotify_id: spotify_id }).select("friends").lean();

    if (user) {
        res.send(user.friends)
    } else {
        res.send("No user with the spotify id" + spotify_id)
    }
})


router.get('/get-reviews', async(req, res) => {
    const {user_id} = req.query
    const reviews = await schemas.Reviews.find({ user_id: user_id }).lean()

    if (reviews) {
        res.send(Array(reviews))
    } else {
        res.send([])
    }
})


router.post('/post-review', async(req, res) => {
    const {user_id, message, song_id, rating} = req.body.params
    const review = await schemas.Reviews.findOne({ song_id: song_id, user_id: user_id }).select("_id").lean();

    if (review) {
        res.send(review._id)
    } else {
        const reviewData = {
            user_id: user_id,
            message: message,
            song_id: song_id,
            rating: rating,
            likes: [],
            commends: [],
        }

        const newReview = new schemas.Reviews(reviewData)
        const saveReview = await newReview.save()

        if (saveReview) {
            res.send(saveUser._id)
        } else {
            res.send("Failure when saving a review")
        }
    }
})

module.exports = router