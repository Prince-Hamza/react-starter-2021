const axios = require('axios').default
var sizeOf = require('buffer-image-size');
const firebase = require('firebase/compat/app').default
require("firebase/compat/storage");


const uploadImages2 = async (Product, simpleJson) => {

    try { firebase.initializeApp(config) } catch (ex) { }

    // console.log(`input images : ${Product.images}`)
    // console.log(`has images : ${Product.hasOwnProperty('images') && Product.images.length > 0}`)

    if (!Product.hasOwnProperty('images') || !Product.images.length || Product.images.length == 0) {
        simpleJson.images = []
        return simpleJson
    }


    // console.log(`Image Uploading Start`)
    const requests = Product.images.map((image) => {
        return uploadImage(image)
    })


    // await Promise.all(requests)
    // .then((response) => {
    //     // console.log(`Promise_All: Response :: ${response}`)
    //     response.forEach((imageInfo) => {
    //         console.log(`Image Info : ${imageInfo}`)
    //         NewImages.push({src: imageInfo.src})
    //         filePathx.push(imageInfo.filePath)
    //     })
    //     Product.images = NewImages
    //     Product.FilePaths = filePathx
    //     console.log(`Product Images Length :: ${Product.images.length}`)
    // })
    // .catch(e => {
    //     console.log(`Error in processing Image :: ${e}`)
    //     return
    // })

    var NewImages = [], filePathx = []
    const response = await Promise.all(requests)
    response.map((imageInfo) => {
        NewImages.push({ src: imageInfo.src })
        filePathx.push(imageInfo.filePath)
    })
    simpleJson.images = NewImages
    simpleJson.Files = filePathx
    return simpleJson

}

const uploadImage = async (image) => {
    try { firebase.initializeApp(config) } catch (ex) { }

    // console.log('image 2 blob')
    let resp

    try {
        resp = await axios.get(image, { responseType: 'arraybuffer' })
    } catch (ex) {
        resp = await axios.get('https://cdn0.iconfinder.com/data/icons/social-network-7/50/27-512.png', { responseType: 'arraybuffer' })
    }

    const buffer = Buffer.from(resp.data)

    var storageRef = firebase.storage().ref('/WooPix')
    var random = getRandom(0, 99999999)
    var picPath = `pic_${random}.jpg`
    var ref = storageRef.child(picPath)
    var metadata = { contentType: 'image/jpeg', public: true }

    await ref.put(buffer, metadata)
    var downloadUrl = await ref.getDownloadURL()
    // console.log('Download Url :: ' + downloadUrl)

    return ({ src: downloadUrl, filePath: '/WooPix/' + picPath, success: true })
}

const getRandom = (min, max) => {
    return Math.trunc(Math.random() * (max - min) + min);
}



const arrangeImages = async (Product) => {

    // console.log(`Product images :: ${Product.images.length}`)

    // if (Product.images[0]) imagesInfo.push(await getImageSize(Product.images[0]))
    // if (Product.images[1]) imagesInfo.push(await getImageSize(Product.images[1]))
    // if (Product.images[2]) imagesInfo.push(await getImageSize(Product.images[2]))
    // if (Product.images[3]) imagesInfo.push(await getImageSize(Product.images[3]))
    // if (Product.images[4]) imagesInfo.push(await getImageSize(Product.images[4]))


    var images = []

    var imgSizeReq = Product.images.map((image) => {
        return getImageSize(image)
    })
    var imagesInfo = await Promise.all(imgSizeReq)

    imagesInfo = imagesInfo.sort((a, b) => b.width - a.width);
    imagesInfo.forEach((item) => { images.push(item.src) })

    return images
}

const getImageSize = async (Uri) => {
    // console.log(`Get Image Size :: ${Uri}`)
    var buffer = 0
    await axios.get(Uri, { responseType: 'arraybuffer' }).then((response) => {
        buffer = Buffer.from(response.data, "utf-8")
        const resp = sizeOf(buffer)
        resp.src = Uri
        return resp

    }).catch(() => {
        return { src: Uri, width: buffer.byteLength }
    })

}




module.exports = {
    uploadImages2,
}