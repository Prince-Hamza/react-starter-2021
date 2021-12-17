const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api")
const firebase = require('firebase/compat/app').default
require("firebase/compat/database");


var cachedCategories = []

const getCategoryIdByName = async (categoryName) => {
    var categoryId = 0
    var categoryObject


    categoryName = modifyCatName(categoryName)

    // console.log(`cat name :: ${categoryName}`)

    if (cachedCategories.length == 0) {
        var categories = await listCategories()
        cachedCategories = categories
    }

    cachedCategories.forEach((cat) => {
        if (cat.name == categoryName) {
            categoryId = cat.id
            categoryObject = { name: cat.name, id: cat.id }
            // console.log(`Found Category : ${categoryId}`)    // :x | 
        }
    })

    // console.log(`categoryId :: ${categoryId}`)

    if (categoryId == 0) {
        console.log(`category not found lets create`)
        categoryId = await createCategory(categoryName)
        categoryObject = { name: categoryName, id: categoryId }
    }

    return categoryObject

}



const modifyCatName = (categoryName) => {
    if (categoryName === 'Software Service & Support') categoryName = 'Software Service Support'
    if (categoryName === 'Voip phone') categoryName = 'Voip Phone'
    if (categoryName.includes('&')) {
        categoryName = categoryName.split('&').join('&amp;')
    }
    return categoryName
}

const createCategory = async (catName) => {


    // console.log(`creating category`)

    var WooCommerceApi = WooCommerceRestApi.default;

    var api = new WooCommerceApi({
        url: 'https://firewallforce.se',
        consumerKey: 'ck_42a75ce7a233bc1e341e33779723c304e6d820cc',
        consumerSecret: 'cs_6e5a683ab5f08b62aa1894d8d2ddc4ad69ff0526',
        version: 'wc/v3'
    });



    try {
        // console.log(`CREATE CATEGORY :: ${catName}`)

        const data = {
            name: catName.toString(),
        };
        var resp = await api.post("products/categories", data)
        console.log(`CREATED CATEGORY :: ${resp.data}`)

        return resp.data.id

    } catch (ex) {
        console.log(`CREATE CATEGORY ERROR :: ${ex}`)
        return 0
    }



}


const listCategories = async () => {

    console.log(`Reading categories from WordPress WooCommerce`)

    var WooCommerceApi = WooCommerceRestApi.default;

    var api = new WooCommerceApi({
        url: 'https://firewallforce.se',
        consumerKey: 'ck_42a75ce7a233bc1e341e33779723c304e6d820cc',
        consumerSecret: 'cs_6e5a683ab5f08b62aa1894d8d2ddc4ad69ff0526',
        version: 'wc/v3'
    })


    var pages = [1, 2, 3], Categories = []

    const catReqs = pages.map((page) => {
        return readCategoryPage(page, api)
    })

    await Promise.all(catReqs)
        .then((response) => {
            // console.log(`read cat resp :: ${response}`)
            response.forEach((catPage) => {
                catPage.forEach((category) => {
                    Categories.push(category)
                })
            })
        })
        .catch((err) => {
            console.log(`Error reading categories :: ${err}`)
        })


    return Categories


}


const readCategoryPage = async (page, api) => {
    const resp = await api.get(`products/categories?page=${page}&per_page=100&_fields=name,id`)
    return resp.data
}



module.exports = getCategoryIdByName