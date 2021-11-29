
const express = require('express')
const axios = require("axios")
const router = express.Router()

const ApiGolang = async (req, res) => {
    console.log("request recieved from React")

    var data = req.body
    var config = {
        method: 'post',
        url: 'https://us-central1-my-first-project-ce24e.cloudfunctions.net/UpdateFirewallForce',
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    }

    await axios(config)
        .then((response) => {
            console.log(JSON.stringify(response.data))
            return res.send(response.data)
        })
        .catch((error) => {
            console.log(error)
            return error
        });
}


router.post('/golangserver', ApiGolang)

module.exports = router

