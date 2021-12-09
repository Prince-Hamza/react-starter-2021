const axios = require('axios').default
const firebase = require('firebase/compat/app').default
require("firebase/compat/storage");


const uploadImages2 = async (Product, method, id) => {

    try { firebase.initializeApp(config) } catch (ex) { }
    console.log(`has images : ${Product.hasOwnProperty('images') && Product.images.length > 0}`)

    if (!Product.hasOwnProperty('images') || !Product.images.length || Product.images.length == 0) {
        return
    }
    console.log(`Image Uploading Start`)


    var NewImages = [], filePathx = []

    //var images = ['https://images.unsplash.com/reserve/Af0sF2OS5S5gatqrKzVP_Silhoutte.jpg']

    const requests = Product.images.map((image) => {
        return uploadImage(image)
    })


    await Promise.all(requests)
        .then((response) => {
            // console.log(`Promise_All: Response :: ${response}`)
            response.forEach((imageInfo) => {
                console.log(`Image Info : ${imageInfo}`)
                NewImages.push({src: imageInfo.src})
                filePathx.push(imageInfo.filePath)
            })
            Product.images = NewImages
            Product.FilePaths = filePathx
            console.log(`Product Images Length :: ${Product.images.length}`)
        })
        .catch(e => {
            console.log(`Error in processing Image :: ${e}`)
            return
        })


    // const response = await Promise.all(requests)
    //response.map((image) => display(image))

}

const uploadImage = async (image) => {
    try { firebase.initializeApp(config) } catch (ex) { }

    console.log('image 2 blob')
    const resp = await axios.get(image, { responseType: 'arraybuffer' })
    const buffer = Buffer.from(resp.data) 

    var storageRef = firebase.storage().ref('/WooPix')
    var random = getRandom(0, 99999999)
    var picPath = `pic_${random}.jpg`
    var ref = storageRef.child(picPath)
    var metadata = { contentType: 'image/jpeg', public: true }

    await ref.put(buffer, metadata)
    var downloadUrl = await ref.getDownloadURL()
    //console.log('Download Url :: ' + downloadUrl)

    // return ({ src: downloadUrl, filePath: '/WooPix/' + picPath, success: true })
    return downloadUrl
}




const getRandom = (min, max) => {
    return Math.trunc(Math.random() * (max - min) + min);
}



module.exports = uploadImages2