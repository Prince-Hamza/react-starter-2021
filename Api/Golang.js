const PriceSet = require('./Prices')
const StockSet = require('./Stock')
const axios = require('axios')
const getCategoryIdByName = require('./Categories')
const getAttributes = require('./Attributes')
const uploadImages2 = require('./Images')



const bundleInfo = async (product, config) => {

    console.log(`Product : ${product}`)
    console.log(`config : ${JSON.stringify(config)}`)


    let price = await PriceSet.getFinalPrice(product)
    let stock = StockSet.stockInfo.prepareStock(product).stockQuantity
    console.log(`input images : ${product.images}`)
    // let images = await uploadImages2(product)
    product.images = [{src:"anyurl"}]

    console.log(`price : ${price}`)
    console.log(`stock : ${price}`)

    var simple = ({
        sku: product.manufacturerSKU.toString(),
        price: price.toString(),
        stock: stock.toString(),
        stockStatus: StockSet.stockInfo.prepareStock(product).stockQuantity.toString(),
    })

    if (config.Categories) {
        let categoryId = await getCategoryIdByName(product.productSubType)
        console.log(`categoryId :  ${categoryId}`)
        simple.categories = [{ id: parseInt(categoryId) }]
    }

    if (config.Images) simple.images = [{ id: 0 }]
    if (config.Attributes) simple.attributes = getAttributes(product)


    console.log("returning ...")
    return simple

}


const ApiGolang = async (req, res) => {

    console.log("request recieved from React")


    var productsArray = req.body.products, config = req.body.config


    var requests = productsArray.map((product) => {
        console.log("bundle Information")
        return bundleInfo(product, config)
    })

    var products = await Promise.all(requests)
    console.log(`final Products : ${JSON.stringify(products)}`)
    products[0].sku = "J9780A"
    console.log(`product 0 : ${products[0]}`)



    var config = {
        method: 'POST',
        //url: 'https://us-central1-my-first-project-ce24e.cloudfunctions.net/ITScopePro',
        url: 'http://localhost:8080',
        headers: {
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({ products: products, config: config })
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