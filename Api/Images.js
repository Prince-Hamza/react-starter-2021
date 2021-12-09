const axios = require('axios').default
const firebase = require('firebase/compat/app').default
require("firebase/compat/storage");


const uploadImages2 = async (Product, method, id) => {

    try { firebase.initializeApp(config) } catch (ex) { }
    console.log(`Lets Upload Images First`)

    if (!Product.images.length || Product.images.length == 0) {
        return
    }

    var NewImages = [], filePathx = []

    //var images = ['https://images.unsplash.com/reserve/Af0sF2OS5S5gatqrKzVP_Silhoutte.jpg']

    const requests = Product.images.map((image) => {
        return uploadImage(image)
    })

    console.log(`Image Uploading Start`)

    await Promise.all(requests)
        .then((response) => {
            // console.log(`Promise_All: Response :: ${response}`)
            response.forEach((imageInfo) => {
                NewImages.push(imageInfo.src)
                console.log(imageInfo.filePath)
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


    const response = await Promise.all(requests)
    response.map((image) => display(image))

}

const uploadImage = async (image) => {
    try { firebase.initializeApp(config) } catch (ex) { }

    console.log('image 2 blob')
    const Buffer = await axios.get(image , {responseType:'arraybuffer'})
    // const blob = await resp.blob()
    // const Buffer = await blob.arrayBuffer()

    var storageRef = firebase.storage().ref('/WooPix')
    var random = getRandom(0, 99999999)
    var picPath = `pic_${random}.jpg`
    var ref = storageRef.child(picPath)
    var metadata = { contentType: 'image/jpeg', public: true }

    await ref.put(Buffer, metadata)
    var downloadUrl = await ref.getDownloadURL()
    //console.log('Download Url :: ' + downloadUrl)

    // return ({ src: downloadUrl, filePath: '/WooPix/' + picPath, success: true })
    return downloadUrl
}




module.exports = uploadImages2