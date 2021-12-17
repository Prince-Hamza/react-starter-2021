const axios = require('axios').default

const titleBySku = async (product) => {


    console.log("sku for pro : ", product.manufacturerSKU)
    var axios = require('axios');

    try {
        var config = {
            method: 'get',
            url: `https://firewallforce.se/wp-json/wc/v3/productbysku?sku=${product.manufacturerSKU}`,
            headers: {
                'Cookie': 'PHPSESSID=328361e93df6a799e4d704ae29c56f42; yith_ywraq_session_00e9b740a5657ac038c46bdaca01c705=36d873d90eb58da7c0ca82245d05c3e4%7C%7C1639849663%7C%7C1639846063%7C%7Cf3e865aff0f114bf0c17f85372f16bac'
            }
        };

        const resp = await axios(config)

        let sku = product.manufacturerSKU ? product.manufacturerSKU : "N/A"
        let brand = product.manufacturer.name ? product.manufacturer.name : "N/A"

        if (resp.data.hasOwnProperty('data') && resp.data.data.status == 404) {
            // return { title: brand + ' ' + sku, sku: sku }
            return brand + ' ' + sku

        } else {
        //    return { title: resp.data.name, sku: resp.data.sku }
            return resp.data.name

        }

    } catch (ex) {
        console.log('product by sku error ', ex)
        let sku = product.manufacturerSKU ? product.manufacturerSKU : "N/A"
        let brand = product.manufacturer.name ? product.manufacturer.name : "N/A"
        // return { title: brand + ' ' + sku, sku: sku }
        return brand + ' ' + sku
    }


    // .then(function (resp) {

    //     console.log(`Wordpress Title: ${resp.data.name}`)
    //     console.log(`Wordpress Sku: ${resp.data.sku}`)

    //     let sku = product.manufacturerSKU ? product.manufacturerSKU : "N/A"
    //     let brand = product.manufacturer.name ? product.manufacturer.name : "N/A"

    //     if (resp.data.data.status == 404) {
    //         return { title: brand + ' ' + sku, sku: sku }
    //     } else {
    //         return { title: resp.data.name, sku: resp.data.sku }
    //     }

    // })
    // .catch(function (error) {
    //     console.log(error);
    //     return
    // });





}

module.exports = titleBySku