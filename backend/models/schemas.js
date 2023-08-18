const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    name: {type: String},
    spotify_id: {type: String, required: true},
    images: {type: Array},
    friends: {type: [String]},
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

const Users = mongoose.model('Users', userSchema, 'users')
const Reviews = mongoose.model('Reviews', reviewSchemas, 'reviews')

const mySchemas = {"Users": Users, "Reviews": Reviews}

module.exports = mySchemas