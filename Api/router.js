
const express = require('express')
const axios = require("axios")
const router = express.Router()
const GolangApiSet = require("./Golang")
const UbuntuApiSet = require("./UbuntuVm")



router.post('/golangserver', GolangApiSet.ApiGolang)
router.post('/vmstart', UbuntuApiSet.StartVm)


module.exports = router

