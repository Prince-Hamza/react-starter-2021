


const getAttributes = (Product) => {

    const attributes = [
        {
            id: 4,
            name: "Brands",
            // slug: "pa_brands",
            options: [Product.manufacturer.name ? Product.manufacturer.name : "N/A"]
        },
        {
            id: 0,
            name: 'Html Specs',
            options: [Product.htmlMainSpecs ? Product.htmlMainSpecs : "N/A"]
        },

        {
            id: 0,
            name: 'estimate Gross Weight',
            options: [Product.estimateGrossWeight ? Product.estimateGrossWeight : "N/A"]
        },
        {
            id: 0,
            name: 'product Model',
            options: [Product.productModel ? Product.productModel : "N/A"]
        },
        {
            id: 0,
            name: 'ean',
            options: [Product.ean ? Product.ean : "N/A"]
        },
        {
            id: 0,
            name: 'warranty Text',
            options: [Product.warrantyText ? Product.warrantyText : "N/A"]
        },
        {
            id: 0,
            name: 'product Type Name',
            options: [Product.productType.name ? Product.productType.name : "N/A"]
        },
        {
            id: 0,
            name: 'product Sub Type Id',
            options: [Product.productSubTypeId ? Product.productSubTypeId : "N/A"]
        },
        {
            id: 0,
            name: 'product Sub Type',
            options: [Product.productSubType ? Product.productSubType : "N/A"]
        },
    ]
    return attributes
}

module.exports = getAttributes