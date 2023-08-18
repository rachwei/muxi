const express = require('express')
const router = express.Router()
const schemas = require('../models/schemas')

router.get('/users', async(req, res) => {
    const {name, spotify_id, images} = req.body

    const userData = {
        name: name,
        spotify_id: spotify_id,
        images: [images]
    }

    const newUser = new schemas.Users(userData)
    const saveUser = await newUser.save()

    if (saveUser) {
        res.send("Message Sent!")
    } else {
        res.send("Failure")
    }
})

module.exports = router