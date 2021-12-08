const PriceSet = require('./Prices')
const StockSet = require('./Stock')
const axios = require('axios')
const getCategoryIdByName = require('./Categories')
const getAttributes = require('./Attributes')




const bundleInfo = async (product, config) => {

    console.log(`Product : ${product}`)

    let price = await PriceSet.getFinalPrice(product)
    let categoryId = await getCategoryIdByName(product.productSubType)
    let stock = StockSet.stockInfo.prepareStock(product).stockQuantity

    console.log(`categoryId :  ${categoryId}`)
    console.log(`price : ${price}`)
    console.log(`stock : ${price}`)

    var simple = ({
        sku: product.manufacturerSKU.toString(),
        price: price.toString(),
        stock: stock.toString(),
        stockStatus: StockSet.stockInfo.prepareStock(product).stockQuantity.toString(),
        categories: [{ id: parseInt(categoryId) }]
    })

    if (config.categories) simple.categories = [{ id: categoryId }]
    if (config.images) simple.images = [{ id: 0 }]
    if (config.attributes) simple.attributes = getAttributes(product)

    console.log("returning ...")
    return ({ success: 'ok' })

}


const ApiGolang = async (req, res) => {

    console.log("request recieved from React")

    var productsArray = req.body.products, config = req.body.config

    var requests = productsArray.map((product) => {
        console.log("bundle Information")
        return bundleInfo(product, config)
    })

    var products = await Promise.all(requests)
    console.log(`final Products : ${products}`)


    var config = {
        method: 'POST',
        //url: 'https://us-central1-my-first-project-ce24e.cloudfunctions.net/ITScopePro',
        url: 'http://localhost:8080',
        headers: {
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({ products: products })
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



module.exports = {
    ApiGolang
}