
const express = require('express')
const axios = require("axios")
const router = express.Router()

const ApiGolang = async (req, res) => {

    console.log("request recieved from React")
    const info = req.body

    info.products.forEach((pro) => {

        pro.supplierStockInfo.stock = pro.supplierStockInfo.stock.toString()
        pro.supplierStockInfo.stockStatusText = pro.productSubType.toString()
        pro.supplierPriceInfo.price = pro.productSubType.toString()
        pro.productSubType = pro.productSubType.toString()
        pro.standardHtmlDatasheet = pro.standardHtmlDatasheet.toString()
        pro.aggregatedStockStatusText = pro.aggregatedStatusText.toString()

    })

    // console.log(typeof info.products[0].supplierPriceInfo.price)
    // console.log(typeof info.products[0].supplierStockInfo.stock)
    // console.log(typeof info.products[0].supplierStockInfo.stockStatusText)
    // console.log(typeof info.products[0].aggregatedStock)
    // console.log(typeof info.products[0].aggregatedStockStatusText)
    // console.log(info.products[0].standardHtmlDatasheet)



    console.log(`sending request`)
    var config = {
        method: 'post',
        url: 'https://us-central1-my-first-project-ce24e.cloudfunctions.net/ITScopePro',
        headers: {
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(info)
    }


    await axios(config)
        .then((response) => {
            console.log(JSON.stringify(response.data))
            return res.send(response.data)
        })
        .catch((error) => {
            console.log(error)
            return res.send({ Error: error })
        })
}


const getHardCoded = () => {
    return `{
        "products": [
            {
                "fields_in_response": [
                    "sku",
                    "price",
                    "stock",
                    "stock_staus"
                ],
                "type": "simple",
                "manufacturerSKU": "C9300L-24P-4G-A",
                "productSubType": "Switch",
                "supplierPriceInfo": {
                    "price": "0"
                },
                "productStockInfo": {
                    "stock": "6",
                    "stockStatusText": "3 In Stock"
                },
                "aggregatedStock": "3",
                "aggregatedStockStatusText": "In Stock",
                "extra": "ok",
                "standardHtmlDatasheet": "iijijihihihi"
            },
            {
                "fields_in_response": [
                    "sku",
                    "price",
                    "stock",
                    "stock_staus"
                ],
                "type": "simple",
                "manufacturerSKU": "C9300L-24P-4G-A",
                "productSubType": "Switch",
                "supplierPriceInfo": {
                    "price": "0"
                },
                "productStockInfo": {
                    "stock": "6",
                    "stockStatusText": "3 In Stock"
                },
                "aggregatedStock": "3",
                "aggregatedStockStatusText": "In Stock",
                "extra": "ok",
                "standardHtmlDatasheet": "iijijihihihi"
            }
        ]
    }`
}


const getSimpleJson = (inputArray) => {

    var postDataArray = []

    inputArray.forEach(item => {

        let newJson = `
                {
                    "fields_in_response" : ["sku" , "price" , "stock" , "stock_staus"],
                    "type" : "simple",
                    "manufacturerSKU": "${item.manufacturerSKU}",
                    "productSubType": "${item.productSubType}",
                    "supplierPriceInfo": {
                        "price": "11"
                    },
                    "productStockInfo": {
                        "stock": "6",
                        "stockStatusText": "3 In Stock"
                    },
                    "aggregatedStock": "3",
                    "aggregatedStockStatusText": "In Stock",
                    "extra": "ok",
                    "standardHtmlDatasheet" : "iijijihihihi"
                }`

        postDataArray.push(newJson)

    })

    return postDataArray

}













const postManBody = `{
    "products": [
        {
            "fields_in_response" : ["sku" , "price" , "stock" , "stock_staus"],
            "type" : "simple",
            "manufacturerSKU": "J9780A",
            "productSubType": "Lenovo",
            "supplierPriceInfo": {
                "price": "11"
            },
            "productStockInfo": {
                "stock": "6",
                "stockStatusText": "3 In Stock"
            },
            "aggregatedStock": "3",
            "aggregatedStockStatusText": "In Stock",
            "extra": "ok",
            "standardHtmlDatasheet" : "iijijihihihi"
        }
        
    ]
}`


router.post('/golangserver', ApiGolang)

module.exports = router

