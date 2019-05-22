const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()

const User = require('../models/user')
const mongoose = require('mongoose')

// Db to connect.
const db = "mongodb://user125:user125@ds259596.mlab.com:59596/eventsdb"

mongoose.connect(db, err=>{
    if (err){
        console.log('Error !' + err)
    } else {
        console.log('Mongodb connection successful.')
    }
})

function verifyToken(req,res,next) {
    if(!req.headers.authorization) {
        return res.status(401).send('Unauthorized request')
    }
    // split on space which gives the array ' Bearer xx.yy.zz' and we just need the token(index 1).
    let token = req.headers.authorization.split(' ')[1]
    if(token === 'null') {
        return res.status(401).send('Unauthorized request')
    }
    let payload = jwt.verify(token, 'secretKey')
    if(!payload){
        return res.status(401).send('Unauthorized request')       
    }
    req.userId = payload.subject
    next()
}

// When a request is made to 'host:PORT\api' ,this fn gets executed.
router.get('/', (req, res)=>{
    res.send('From API route.')
})

// post request to register.
router.post('/register', (req, res) => {
    let userData = req.body

    // convert the data to mogoose format
    let user = new User(userData)

    // save the data to the db.
    user.save((err, registeredUser) =>{
        if (err) {
            console.log(err)
        } else {
            // generate the token: once user is saved, create the payload 
            let payload = { subject: registeredUser._id}
            
            // sign the payload and generate the token.
            let token = jwt.sign(payload, 'secretKey')

            // Send the token as an object. 
            res.status(200).send({token})
        }
    })

})

// post request to login.
router.post('/login', (req, res) => {
    let userData = req.body

    console.log('Userdata for login: ' + userData.email, userData.password)
    // Check if user already registered.
    User.findOne({email: userData.email}, (error, user) => {
        if (error) {
            console.log('Failed to find the user in the db.');
        } else {
            if(!user) {
                res.status(401).send('Invalid email.')
            } else {
                if(user.password !== userData.password) {
                    res.status(401).send('Invalid password')
                } else {
                    // generate the token: once user is found, create the payload.
                    let payload = { subject: user._id}
            
                    // sign the payload and generate the token.
                    let token = jwt.sign(payload, 'secretKey')
            
                    res.status(200).send({token})
                }
            }
        }
    })
})


// Just to simplify, create some hard coded events.
router.get('/events', (req, res) => {
    let events= [
        {
            "_id": "1",
            "name": "Auto Expo",
            "description": "Auto show coming to the city. Be ready to be there...",
            "date": "2019-05-31T09:30:40.211Z"
        },
        {
            "_id": "1",
            "name": "Job Fair",
            "description": "Job fair for every one.Mark your calendars...",
            "date": "2019-05-28T10:30:40.211Z"
        },
        {
            "_id": "1",
            "name": "Kids Play",
            "description": "Kids fun day. don't miss it !!",
            "date": "2019-05-22T11:00:40.211Z"
        },
        {
            "_id": "1",
            "name": "home expo",
            "description": "A unique home decor show. Be ready to be there...",
            "date": "2019-05-26T13:00:40.211Z"
        }
    ];
    res.json(events)
})

// Just to simplify, create some hard coded events.
router.get('/special', verifyToken, (req, res) => {
    let events= [
        {
            "_id": "1",
            "name": "Sp_Auto Expo",
            "description": "Auto show coming to the city. Be ready to be there...",
            "date": "2019-05-31T09:30:40.211Z"
        },
        {
            "_id": "1",
            "name": "Sp_Job Fair",
            "description": "Job fair for every one.Mark your calendars...",
            "date": "2019-05-28T10:30:40.211Z"
        },
        {
            "_id": "1",
            "name": "Sp_Kids Play",
            "description": "Kids fun day. don't miss it !!",
            "date": "2019-05-22T11:00:40.211Z"
        },
        {
            "_id": "1",
            "name": "Sp_home expo",
            "description": "A unique home decor show. Be ready to be there...",
            "date": "2019-05-26T13:00:40.211Z"
        }
    ];
    res.json(events)
})



module.exports = router