const express = require('express')
const bodyParser = require('body-parser')
const api = require('./routes/api')

const PORT = 3000
const app= express()

app.use(bodyParser.json())

// Route the request made to(1st-param) 'host:PORT\api' to (2nd-param) api route.
app.use('/api', api)

app.get('/',function(req, res) {
    res.send('hello from server')
})

app.listen(PORT, function() {
    console.log('Server is up and running at Port: ', + PORT);
})