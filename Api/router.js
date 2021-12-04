
const express = require('express')
const axios = require("axios")
const router = express.Router()

const ApiGolang = async (req, res) => {

    console.log("request recieved from React")
    var info = req.body, productsUpdated = 0

    const simpleJsonProducts = simplieItScopeJson(info)

    console.log(`sending request`)
    simpleJsonProducts.products[0].sku = 'J9780A'

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
            console.log(response.data)
            let update = 0
            if (!response.data.hasOwnProperty('update')) update += 2
            return res.send({ updateLength: update, data: response.data })
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




router.post('/golangserver', ApiGolang)

module.exports = router

