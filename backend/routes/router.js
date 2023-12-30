const express = require('express')
const axios = require('axios')
const router = express.Router()
const schemas = require('../models/schemas')

var cron = require('node-cron');

const trainRecModel = async() => {
    const users = await schemas.Users.find().lean().select('_id');
    const reviews = await schemas.Reviews.find().lean();

    try {
        const args = {
          users: users,
          reviews: reviews,
        };
    
        await axios.post('http://127.0.0.1:5000/train', args);
        console.log('Triggered train endpoint')
    } catch (error) {
        console.error('Error triggering Flask endpoint train:', error.message);
    }
};

cron.schedule('* * * * *', trainRecModel);


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


router.post('/trainRecModel', async(req, res) => {
    const users = await schemas.Users.find().lean().select('_id');
    const reviews = await schemas.Reviews.find().lean();
    console.log(users)
    console.log(reviews)

    try {
        const arguments = {
          users: users,
          reviews: reviews,
        };
    
        await axios.post('http://127.0.0.1:5000/train', arguments);
        res.send('Triggered train endpoint')
    } catch (error) {
        console.error('Error triggering Flask endpoint train:', error.message);
        res.status(500).send('Internal Server Error');
    }
})

router.get('/getRecommendations', async(req, res) => {

    try {
        const user_id = req.query.user_id
        const arguments = {
          user_id: user_id
        };
        console.log("in the get recommendations function!")
        const recs = await axios.get('http://127.0.0.1:5000/recommend', { params: arguments });
        console.log("got back", recs.data)
        res.send(recs.data)
    } catch (error) {
        console.error('Error triggering Flask endpoint train:', error.message);
        res.status(500).send('Internal Server Error');
    }
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

router.post('/commentOnReview', async(req, res) => {
    const {user_id, review_id, comment} = req.body.params
    const review = await schemas.Reviews.updateOne(
        {"_id": review_id},
        {"$push": {"comments": {user_id, comment}}}
    )

    if (review) {
        res.sendStatus(200)
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



router.get('/getConvos', async(req, res) => {
    const user_id = req.query.user_id
    const convos = await schemas.Convos.find({ $or: [{p1: user_id},{p2: user_id}]}).lean();

    if (convos) {
        res.send(convos)
    } else {
        res.send([])
    }
})


router.get('/getNewMessages', async(req, res) => {
    const {convo_id, last_message_id} = req.query
    const convo = await schemas.Convos.findOne({_id: convo_id}).select("_id createdAt").lean();
    
    let lastMessage = convo.createdAt
    if (last_message_id) {
        const latest = await schemas.Messages.findOne({_id: last_message_id}).select("createdAt").lean()
        if (latest) {
            lastMessage = latest.createdAt 
        }
    }

    const messages = await schemas.Messages.find({
        $and: [
          { convo_id: convo_id },
          { createdAt: { $gt: lastMessage } }
        ]
      }).sort({ createdAt: 1 }).lean();

    if (messages && messages.length) {
        res.send({"messages": messages, "latest": messages[messages.length - 1]._id})
    } else res.send({"messages": [], "latest": last_message_id})
})




router.post('/sendMessage', async(req, res) => {
    const {sender_id, convo_id, content} = req.body.params
    console.log(sender_id + " " + convo_id + " " + content)
    if (!content) res.sendStatus(500)
    let convo

    try {
        convo = await schemas.Convos.findOneAndUpdate({_id: convo_id}, {
            $inc: { num_messages: 1 }
        }, {new: true}).lean();
    } catch(error) {
        res.sendStatus(500)
        return
    }

    const receiver_id = convo.p1 == sender_id ? convo.p2 : convo.p1

    const newMessageData = {
        sender_id: sender_id,
        receiver_id: receiver_id,
        content: content,
        convo_id: convo_id
    }

    const newMessage = new schemas.Messages(newMessageData)
    const saveMessage = await newMessage.save()

    if (saveMessage) {
        res.send(saveMessage._id)
    } else {
        res.send("Failure when saving a message")
    }
})


router.post('/createConvo', async(req, res) => {
    const {sender_id, receiver_id} = req.body.params

    try {
        const convo = await schemas.Convos.findOne({
            $or: [
                { $and: [{ p1: sender_id }, { p2: receiver_id }] },
                { $and: [{ p2: receiver_id }, { p2: sender_id }] }
            ]
        }).select('_id').lean();
        console.log("convo id", convo)

        if (convo) {
            res.send(convo._id)
            return
        }

        const newConvoData = {p1: sender_id, p2: receiver_id, num_messages: 0}
        const newConvo = new schemas.Convos(newConvoData)
        const saveConvo = await newConvo.save()
    
        if (saveConvo) {
            console.log("Created convo with id: ", saveConvo._id)
            res.send(saveConvo._id)
            return
        } else {
            res.send("Failure when saving a message")
            return
        }

    } catch(error) {
        res.sendStatus(500)
        return
    }
})



module.exports = router