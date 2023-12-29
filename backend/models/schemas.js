const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    name: {type: String},
    spotify_id: {type: String, required: true},
    images: {type: Array},
    following: {type: [String]},
    followedby: {type: [String]},
    entryDate : {type:Date, default:Date.now}
})

const reviewSchemas = new Schema({
    user_id: {type: String, required: true},
    message: {type: String},
    song_id: {type: String},
    rating: {type: Number},
    likes: {type: Array},
    comments: {type: Array},
    entryDate : {type:Date, default:Date.now}
})

const songSchema = new Schema({
    name: {type: String, required: true},
    artist: {type: String, required: true},
    spotify_id: {type: String, required: true},
    preview: {type: String},
    img: {type: String},
    danceability: {type: Schema.Types.Decimal128},
    energy: {type: Schema.Types.Decimal128},
    loudness: {type: Schema.Types.Decimal128},
    speechiness: {type: Schema.Types.Decimal128},
    acousticness: {type: Schema.Types.Decimal128},
    instrumentalness: {type: Schema.Types.Decimal128},
    liveness: {type: Schema.Types.Decimal128},
    valence: {type: Schema.Types.Decimal128},
    acousticness_artist: {type: Schema.Types.Decimal128},
    danceability_artist: {type: Schema.Types.Decimal128},
    energy_artist: {type: Schema.Types.Decimal128},
    instrumentalness_artist: {type: Schema.Types.Decimal128},
    liveness_artist: {type: Schema.Types.Decimal128},
    speechiness_artist: {type: Schema.Types.Decimal128},
    valence_artist: {type: Schema.Types.Decimal128},
})

const friendRequestSchema = new Schema({
    requester: {type: String, required: true},
    responder: {type: String, required: true},
}, {timestamps: true}
)

const Users = mongoose.model('Users', userSchema, 'users')
const Reviews = mongoose.model('Reviews', reviewSchemas, 'reviews')
const Songs = mongoose.model('Songs', songSchema, 'Music')
const FriendRequests = mongoose.model('FriendRequests', friendRequestSchema, 'friend_request')

const mySchemas = {"Users": Users, "Reviews": Reviews, "Songs": Songs, "FriendRequests": FriendRequests}

module.exports = mySchemas