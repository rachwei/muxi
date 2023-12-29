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


router.get('/getSongInfo', async(req, res) => {
    const {song_id} = req.query
    const song = await schemas.Songs.findOne({ _id: song_id }).lean()
    if (song) res.send(song)
    else res.send(null)
})


router.get('/followStatus', async(req, res) => {
    const {user_id, friend_id} = req.query
    const user = await schemas.Users.findOne({ _id: user_id }).select("following").lean();
    if (user.following.includes(friend_id)) { // change this to our id?
        res.send("following")
        return;
    }

    const exist = await schemas.FriendRequests.findOne({ requester: user_id, responder: friend_id }).lean();
    if (exist) {
        res.send("requested")
    } else {
        res.send("none")
    }
})

router.post('/acceptRequest', async(req, res) => {
    const {request} = req.body.params
    const requester = request.requester;
    const responder = request.responder;
    await schemas.FriendRequests.deleteOne({requester: requester, responder: responder}).then(function(){
        }).catch(function(error){
            console.log(error)
            res.send("error");
            return;
        });
    
    await schemas.Users.updateOne({ _id: requester, following: {$nin: [responder]}},{$addToSet: {following: responder}}
      ) .then(function(){

        }).catch(function(error){
            console.log(error)
            res.send("error");
        });
    await schemas.Users.updateOne({ _id: responder, followedby: {$nin: [requester]}},{$addToSet: {followedby: requester}}
        ) .then(function(){
                res.sendStatus(200);
            }).catch(function(error){
                console.log(error)
                res.send("error");
            });
})

router.post('/rejectRequest', async(req, res) => {
    const {request} = req.body.params
    await schemas.FriendRequests.deleteOne({requester: request.requester, responder: request.responder}).then(function(){
            res.sendStatus(200);
        }).catch(function(error){
            console.log(error)
            res.send("error");
        });
})

router.get('/getRequests', async(req, res) => {
    const {user_id} = req.query
    const requests = await schemas.FriendRequests.find({ responder: user_id }).lean()
    res.send(requests)
})


router.post('/changeFollowStatus', async(req, res) => {
    const {user_id, friend_id, status} = req.body.params
    const mongoose_update = { requester: user_id, responder: friend_id }

    console.log("In the change friend status", status)

    if (status == "none") {
        await schemas.FriendRequests.findOneAndUpdate(mongoose_update, mongoose_update, {
            new: true,
            upsert: true
        }).then(function(){
            res.send("requested");
        }).catch(function(error){
            console.log(error)
            res.send("error");
        });

    } else if (status == "requested") {
        await schemas.FriendRequests.deleteOne(mongoose_update)
        .then(function(){
            res.send("none");
        }).catch(function(error){
            console.log(error)
            res.send("error");
        });

    } else if (status == "following") {
        await schemas.Users.updateOne({_id : user_id}, { $pull: { following: friend_id }})
        .then(function(){
            res.send("none");
        }).catch(function(error){
            console.log(error)
            res.send("error");
        });
    } else {
        res.send("error")
    }
})


router.get('/songs', async(req, res) => {
    const search = req.query.searchQuery;
    let songs = []

    if (search) {
        songs = await schemas.Songs.aggregate([
            {
                $search: {
                    index: "songsearch",
                    autocomplete: {
                        query: search,
                        path: "name",
                    },
                },
            },
            {
                $limit: 5,
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    artist: 1,
                    spotify_id: 1,
                    img: 1,
                },
            },
        ])
    } else {
        songs = await schemas.Songs.find().limit(10)
    }

    return res.status(200).json({
        statusCode: 200,
        message: 'Fetched songs',
        data: { songs },
    })
}) 


router.get('/usersearch', async(req, res) => {
    const search = req.query.searchQuery;
    let users = []

    if (search) {
        users = await schemas.Users.aggregate([
            {
              $search:
                {
                  index: "usersearch",
                  autocomplete: {
                    query: search,
                    path: "name",
                  },
                },
            },
            {
              $limit:
                10,
            },
            {
              $project:
                {
                  _id: 1,
                  name: 1,
                  spotify_id: 1,
                  images: 1,
                },
            },
          ])
    } else {
        users = await schemas.Users.find().limit(10)
    }

    return res.status(200).json({
        statusCode: 200,
        message: 'Fetched users',
        data: { users },
    })
}) 


router.get('/following', async(req, res) => {
    const {user_id} = req.query
    const user = await schemas.Users.findOne({ _id: user_id }).select("following").lean();

    if (user) {
        res.send(user.following)
    } else {
        res.send("No user with the spotify id" + user_id)
    }
})


router.get('/get-reviews', async(req, res) => {
    const {user_id} = req.query
    const reviews = await schemas.Reviews.find({ user_id: user_id }).sort({"entryDate": -1}).lean()
    res.send(reviews)
})


router.get('/get-all-reviews', async(req, res) => {
    const {user_id} = req.query
    const friends_query = await schemas.Users.findOne({ _id: user_id }).lean()

    const friends = friends_query.following
    const reviews_result = await schemas.Reviews.find({ user_id: {"$in": friends} }).sort({"entryDate": -1}).lean()
    res.send(reviews_result)
})


router.post('/like-review', async(req, res) => {
    const {user_id, review_id} = req.body.params
    const review = await schemas.Reviews.updateOne(
        {"_id": review_id},
        {"$addToSet": {"likes": user_id}}
    )

    if (review) {
        res.send(review_id)
    } else {
        res.send("Failure when liking this post", review_id)
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
            res.send(saveReview._id)
        } else {
            res.send("Failure when saving a review")
        }
    }
})

module.exports = router