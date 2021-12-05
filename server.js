require('dotenv').config()
const express = require('express');
const app = express();
var http = require('http').Server(app);
const cors = require('cors');
const bodyParser = require('body-parser')
const WebSocketServer = require('websocket').server;
const request = require('request');
const fs = require('fs')
const axios = require('axios').default
const router = require('./Api/router.js')
const ubuntuVM = require('./ubuntuvm')
const firebase = require('firebase/compat/app').default
require('firebase/compat/database')

const VirtualProcess = false

app.use(cors());
app.use(bodyParser.json({ limit: '5000mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', parameterLimit: 100000, extended: true }))
app.use(bodyParser.json({ limit: '500mb' }))


app.use('/', express.static(__dirname + '/build'))
app.use('/api', router)


const port = process.env.PORT;
const server = app.listen(port || 5000)
server.setTimeout(100000 * 10);
console.log(`Server running on port: ${port || 5000}`)



const streamJson = (ws) => {

    app.get('/api/stream/:key/:resume', function (req, res) {

        console.log('Api Starts')
        console.log(`itScope Key : ${req.params.key}`)
        console.log(`resume from : ${req.params.resume}`)

        var proReadyCount = 0, resumeCount = req.params.resume
        const compiler = new streamingCompiler(ws, resumeCount)

        var stream = request.get(`https://api.itscope.com/2.0/products/exports/${req.params.key}`).auth('m135172', 'GXBlezJK0n-I55K4RV_f0vHIRrFq_YcTNh9Yz735LJs', false)

        stream.on('data', (buffer) => {
            let JsonParticle = getJsonFromBuffer(buffer)
            let lineStream = JsonParticle.split('\n')
            lineStream.map((line) => compiler.parseLine(line))
        })

    })

}

const getJsonFromBuffer = (buffer) => {
    //  take each part of buffer as seperate buffer

    // console.log(`buffer length ${buffer.length}`)

    let bufferSliceList = [], lastIndex = buffer.length - 1

    for (let n = 0; n <= lastIndex; n++) {
        bufferSliceList.push(Buffer.from(buffer.slice(n, n + 1)))
    }

    let bufferSliceString = ''
    bufferSliceList.forEach((sliceBuffer) => {
        bufferSliceString += sliceBuffer.toString()
    })

    return bufferSliceString
}

const toggleVM = () => {
    app.get('/api/togglevm', function (req, res) {
        if (req.body.switch) VirtualProcess = true
        if (!req.body.switch) VirtualProcess = false
        return res.send({ success: VirtualProcess })
    })
}

const initializeFirebase = (x) => {
    firebase.initializeApp({
        apiKey: "AIzaSyCnD-xueHVA0gwNjBLUu5hlB8x8jhMMgOw",
        authDomain: "kidland-5754b.firebaseapp.com",
        databaseURL: "https://kidland-5754b-default-rtdb.firebaseio.com",
        projectId: "kidland-5754b",
        storageBucket: "kidland-5754b.appspot.com",
        messagingSenderId: "291891653552",
        appId: "1:291891653552:web:013a263ba778e7f60ac475"
    })
}

const getVmConfig = async () => {
    const resp = await firebase.database().ref('/vmConfig').once('value')
    const data = resp.val()
    return data
}

const setVmConfig = async () => {
    return await firebase.database().ref('/vmConfig').set({
        key: '2b3d99b1-d22f-4079-b210-81cf8d25b908',
        priceStock: true,
        titles: true,
        descriptions: true,
        categories: false,
        attributes: false,
        images: false,
        update: true,
        create: false,
    })
}


const VirtualMachine = async () => {
    if (VirtualProcess) {
        streamJson()
        initializeFirebase()
        let config = await getVmConfig()
        ubuntuVM.initStream(config)
    }
}

VirtualMachine()


const wsServer = new WebSocketServer({
    httpServer: server
})

wsServer.on('connect', function (ws) {
    console.log("connected")
    app.ws = ws;

    !VirtualProcess && streamJson(ws)
    VirtualProcess && console.log(`Virtual Process is set to true`)
})


wsServer.on('request', function (request) {
    const connection = request.accept(null, request.origin);
    connection.on('message', function (message) {
        // console.log('Received Message:', message.utf8Data);
        // connection.sendUTF('Hi this is WebSocket server!');
    });
    connection.on('close', function (reasonCode, description) {
        console.log('Client has disconnected');
    });
})




class streamingCompiler {
    constructor(ws, resumeCount) {
        this.objectString = ""

        this.skipLine = false // used
        this.stopline = false // used
        this.countBracket = 0 // used
        this.once = false // used

        this.countOpeningBrackets = 0
        this.countClosingBrackets = 0

        this.equalBracketsReached = false
        this.loopLimit = 10;

        this.product = ""
        this.first = true

        this.socket = ws
        this.resumeCount = resumeCount
        this.proReadyCount = 0
        //  this.socket.send('streaming')
    }


    parseLine = (line) => {
        //if (!this.stopline) {
        //  console.log('streaming Json')
        this.makeKeyVauePair(line)
        //}
    }


    makeKeyVauePair = (line) => {

        if (line.includes('puid') && !this.first) {
            //console.log('product complete')
            this.product = this.product
            this.product = this.product.substring(0, this.product.lastIndexOf('}'))
            let finalize = "{" + this.product + "}"
            var parseFinalize

            try {
                parseFinalize = JSON.parse(finalize)
                // console.log(`final Product : ${parseFinalize}`)
            } catch (ex) {
                console.log('')
            }

            this.proReadyCount++
            if (parseFinalize !== undefined) {
                VirtualProcess && ubuntuVM.onProduct(parseFinalize)
                !VirtualProcess && this.socket.send(JSON.stringify(parseFinalize))
            }
            this.product = ""
            this.first = true
        }

        if (!this.first) this.product += line

        if (line.includes('puid') && this.first) {
            //console.log('found puid')
            this.product += line
            this.first = false
        }

    }

}