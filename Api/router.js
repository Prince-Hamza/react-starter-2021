
const express = require('express')
const axios = require("axios")
const router = express.Router()

const ApiGolang = async (req, res) => {

    console.log("request recieved from React")
    var info = req.body, productsUpdated = 0

    const simpleJsonProducts = simplieItScopeJson(info)

    console.log(`sending request`)
    // console.log(JSON.stringify(simpleJsonProducts))

    var config = {
        method: 'POST',
        url: 'https://us-central1-my-first-project-ce24e.cloudfunctions.net/ITScopePro',
        //url: 'http://localhost:8080',
        headers: {
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(simpleJsonProducts)
    }


    await axios(config)
        .then((response) => {
            console.log(JSON.stringify(response.data))
            if (!response.data.hasOwnProperty('update')) {
                console.log("Products Updated")
                productsUpdated = response.data.length
                console.log("update : " + productsUpdated)
            }
            return res.send({ updateLength: response.data.length, data: response.data })
        })
        .catch((error) => {
            console.log(error)
            return res.send({ Error: error })
        })
}



const simplieItScopeJson = (jsonBody) => {

    var simpleProductsArray = []

    jsonBody.products.forEach((product) => {
        var simple = ({
            sku: product.manufacturerSKU.toString(),
            price: product.supplierPriceInfo.price.toString(),
            stock: product.supplierStockInfo.stock.toString(),
            stockStatus: product.supplierStockInfo.stockStatusText.toString(),
            category: product.toString(),
            standardHtmlDatasheet: product.standardHtmlDatasheet.toString()
        })

        simpleProductsArray.push(simple)
    })

    return ({ products: simpleProductsArray })

}

// const changeTypes = (jsonBody) => {

//     jsonBody.products.forEach((pro) => {

//         pro.supplierStockInfo.stock = pro.supplierStockInfo.stock.toString()
//         pro.supplierStockInfo.stockStatusText = pro.productSubType.toString()
//         pro.supplierPriceInfo.price = pro.productSubType.toString()
//         pro.productSubType = pro.productSubType.toString()
//         pro.standardHtmlDatasheet = pro.standardHtmlDatasheet.toString()
//         pro.aggregatedStockStatusText = pro.aggregatedStatusText.toString()

//     })

//     return jsonBody
// }



router.post('/golangserver', ApiGolang)

module.exports = router

