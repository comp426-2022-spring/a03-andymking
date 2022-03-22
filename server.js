const minimist = require('minimist')
const express = require('express')
const app = express()
const args = minimist(process.argv)
const morgan = require('morgan')
const fs = require('fs')

var port = args['port'] ? args['port'] : 5000

function coinFlip() {
    return Math.random() > 0.5 ? 'heads' : 'tails';
}

function coinFlips(flips) {
    let out = Array(flips).fill(null);
    if (flips >= 1) {
      for (let i = 0; i < flips; i++) {
        let flip = coinFlip();
        out[i] = flip;
      }
    } else {
      out[0] = coinFlip();
    }
    return out;
  }

function countFlips(array) {
    let desc = {tails: 0, heads: 0};
    for(let i = 0; i < array.length; i++) {
      array[i] == 'heads' ? desc.heads += 1 : desc.tails += 1;
    }
    return desc;
}

function flipACoin(call) {
    let out = {call: '', flip: '', results: ''}
    if (call != 'heads' && call != 'tails') {
      return 'Error: no input.\nUsage: node guess-flip --call=[heads|tails]';
    } else {
      let flip = coinFlip();
      let result = flip == call ? 'win' : 'lose';
      out.call = call, out.flip = flip, out.results = result;
      return out;
    }
}

const server = app.listen(port, () => {
    console.log('App is running on port %PORT%'.replace('%PORT%', port))
})

// Log with morgan 
app.use(morgan('common'))
// also if you're logging, in bash rush node server.js > ./access.log and output is stored in access.log
app.use(fs.writeFile('./access.log', data, 
    {flag: 'a'}, (err, req, res, next) => {
        if (err) {
            console.error(err)
        } else {
            console.log()
        }
    }

))


app.get('/app', (req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('status', 200)
    res.end('200 OK')
})

app.get('/app/flip', (req, res) => {
    res.setHeader('Content-Type', 'text/json');
    res.setHeader('status', 200);
    var flip = coinFlip()
    res.json({'flip' : flip})
})

app.get('/app/flips/:number', (req, res) => {
    res.setHeader('Content-Type', 'text/json');
    res.setHeader('status', 200);
    var flips = coinFlips(req.params.number)
    res.json({'raw' : flips, 'summary' : countFlips(flips)})
})

app.get('/app/flip/call/heads', (req, res) => {
    res.setHeader('Content-Type', 'text/json');
    res.setHeader('status', 200);
    res.json(flipACoin('heads'))
})

app.get('/app/flip/call/tails', (req, res) => {
    res.setHeader('Content-Type', 'text/json');
    res.setHeader('status', 200);
    res.json(flipACoin('tails'))
})

app.use(function(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.status(404).send('404 Not Found')
})