const PriceSet = require('./Prices')
const StockSet = require('./Stock')
const axios = require('axios')
// const getCategoryIdByName = require('./Categories')
const getAttributes = require('./Attributes')
const Images = require('./Images')
const config = require('./config')
const fs = require('fs')
const titleBySku = require('./WooRestApi')
const firebase = require('firebase/compat/app').default
require("firebase/compat/database");






const bundleInfo = async (product, config, wpList) => {

    let price = await PriceSet.getFinalPrice(product)
    let stock = StockSet.stockInfo.prepareStock(product).stockQuantity

    // console.log(`Price : ${price}`)
    // console.log(`Stock : ${stock}`)

    let sku = product.manufacturerSKU ? product.manufacturerSKU : "N/A"
    let brand = product.manufacturer.name ? product.manufacturer.name : "N/A"
    //let wpName = await titleBySku(product)
    //console.log("Final Title : ", wpName)


    var simple = ({
        id: product.puid ? product.puid : 0,
        title: brand + ' ' + sku,
        brand: brand ? brand : 'unbranded',
        sku: sku ? sku : "N/A",
        price: price.toString(),
        stock: stock.toString(),
        stockStatus: StockSet.stockInfo.prepareStock(product).wpStockStatus.toString(),
        description: product.description ? product.longDescription : 'N/A',
        short_description: product.shortDescription ? product.shortDescription : "N/A",
    })

    if (config.Categories) {
        // let categoryInfo = await getCategoryIdByName(product.productSubType)
        // console.log(`categoryId :  ${categoryInfo.id}`)
        // simple.categories = [{ id: parseInt(categoryId) }] // wordpress
        simple.category = { name: product.productSubType ? product.productSubType : "Uncategorized" }
    }

    if (config.Images) {
        simple.images = product.images
    }

    if (config.Attributes) simple.attributes = getAttributes(product)


    // console.log(`simple Json Product : ${JSON.stringify(simple)}`)
    return simple

}


const ApiGolangWordPress = async (req, res) => {

    console.log("request recieved from React")

    var productsArray = req.body.products, config = req.body.config

    console.log("bundle Information")


    var requests = productsArray.map((product) => {
        return bundleInfo(product, config)
    })

    var products = await Promise.all(requests)

    // console.log(`final Products : ${JSON.stringify(products)}`)

    var config = {
        method: 'POST',
        //url: `https://us-central1-my-first-project-ce24e.cloudfunctions.net/ITScopePro?images=${config.Images}&attributes=${config.Attributes}&categories=${config.Categories}`,
        url: `http://localhost:8080?images=${config.Images}&attributes=${config.Attributes}&categories=${config.Categories}`,
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
            return res.send({ updateLength: update, data: response.data, products: products })
        })
        .catch((error) => {
            console.log(error)
            return res.send({ Error: error })
        })

}



const firebaseConnect = () => {
    try { firebase.initializeApp(config) } catch (ex) { }
}





const ApiFirebase = async (req, res) => {

    console.log("request recieved from React")

    var productsArray = req.body.products, config = req.body.config

    // var wpNameRequests = productsArray.map((product) => {
    //     return titleBySku(product)
    // })

    // var titleReqResp = await Promise.all(wpNameRequests)
    // console.log(`Titles Resp :: ${titleReqResp}`)

    var requests = productsArray.map((product) => {
        console.log("bundle Information")
        return bundleInfo(product, config)
    })
    var products = await Promise.all(requests)

    firebaseConnect()

    var FirebasePushRequest = products.map((product) => {
        return uploadToFirebase(product)
    })
    await Promise.all(FirebasePushRequest)

    return res.send({ updateLength: productsArray.length, data: [], products: [] })

}


const getValidPath = (path) => {
    let newPath = path
    var invalids = [".", "$", "#", "[", "]", ","]
    invalids.map((symbol) => {
        if (path.includes(symbol)) {
            console.log(`invalid path detected : ${path}`)
            newPath = path.split(symbol).join(" ")
        }
    })

    return newPath
}

const insertBrandsToCategoryBrands = async (product) => {
    let Brands = []
    let catBrandList = await firebase.database().ref(`Info/${product.category.name}`).once('value')
    let catInfoVal = await catBrandList.val()
    if (catInfoVal !== null && catInfoVal.hasOwnProperty('Brands')) {
        catInfoVal.Brands.forEach((item) => { Brands.push(item) })
    }
    Brands.push(product.brand)
    let uniqueBrands = [...new Set(Brands)]
    await firebase.database().ref(`Info/${product.category.name}`).set({ Brands: uniqueBrands })
    return "success"
}


const uploadToFirebase = async (product) => {

    let path = `Categories/${product.category.name}/${product.brand}/${product.id}`
    path = getValidPath(path)
    path = path.includes(".") ? path.split(".").join(" ") : path
    console.log(`Path :: ${path}`)



    await firebase.database().ref(path).update(product)
    await firebase.database().ref(`Products/${product.id}`).set({ path: path })

    await insertBrandsToCategoryBrands(product)

    return "success"

}


const deleteAllData = () => {

    var file = fs.readFileSync('catx.txt')
    var fileData = file.toString()
    console.log('fileData', fileData)
    var Categories = fileData.split('\n')
    console.log('categories')

    Categories.forEach((cat) => {
        firebase.database().ref('/' + cat).remove()
        console.log('removed', cat)
    })

}

module.exports = {
    ApiGolangWordPress,
    ApiFirebase
}