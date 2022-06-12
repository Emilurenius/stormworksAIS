// All external modules are loaded in:
const express = require('express')
const app = express()
const path = require('path')
const fs = require('fs')
const cors = require('cors')

const statusMeanings = ['SOS', 'At port', 'Anchored', 'In transit']

let connectedNodes = {
}

const randint = (min,max) => {
	return Math.floor(Math.random()*(max-min+1)+min);
}

const randID = () => {
	console.log('Generating random ID')
	let id = ''

	while (true) {
		for (let i = 0; i < 4; i++) {
			const newInt = randint(0, 9)
			id = `${id}${newInt}`
		}
		console.log(id)
		if (!(id in connectedNodes)) {
			break
		}
	}
	return id
}

const timelog = (printData) => {
  console.log(`${new Date()} >> ${printData}`)
}

const timeWarn = (warnData) => {
  console.warn(`\n${new Date()} >> ${warnData}`)
}

// Reading input from terminal start
const port = parseInt(process.argv[2]) || 3000
console.log(`${port} registered as server port`)
// Reading input from terminal end

app.use(cors()) // Making sure the browser can request more data after it is loaded on the client computer.

app.use('/static', express.static('public'))

app.get('/', (req, res) => {
	timelog('Main page loaded')
  res.send('Server is up')
})

app.get('/connect', (req, res) => {

	let nodeID
	if (req.query.id) {
		timelog('Existing node updated')
		nodeID = req.query.id
	}
	else {
		timelog('New node connected')
		nodeID = randID()
	}
	req.query.status = req.query.status.split('.')[0]
	console.log(`Node name: ${req.query.name}\nNode type: ${req.query.type}\nNode posX: ${req.query.posx}\nNode posY: ${req.query.posy}\nNode status: ${req.query.status}: ${statusMeanings[req.query.status]}`)
	connectedNodes[nodeID] = {
		'name': req.query.name,
		'type': req.query.type,
		'status': req.query.status,
		'posx': req.query.posx,
		'posy': req.query.posy
	}
	res.status(202)
	res.send(`${nodeID}`)
})

app.get('/getNodes', (req, res) => {
	res.send(connectedNodes)
})


app.listen(port, () => console.log(`Listening on ${port}`))