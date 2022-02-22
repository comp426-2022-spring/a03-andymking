const express = require('express')
const app = express()

var port = 5000

function coinFlip() {
    return Math.random() > 0.5 ? 'heads' : 'tails';
}

const server = app.listen(port, () => {
    console.log('App is running on port %PORT%'.replace('%PORT%', port))
})

app.get('/app', (req, res) => {
    res.status(200).end('OK')
    res.type('text/plain')
})

app.get('/app/flip', (req, res) => {
    var flip = coinFlip()
    res.status(200).json({'flip' : flip})
})

app.use(function(req, res) {
    res.status(404).send("Endpoint does not exist")
    res.type("text/plain")
})