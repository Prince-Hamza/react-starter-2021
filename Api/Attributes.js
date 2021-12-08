


const getAttributes = (Product) => {

    const attributes = [
        {
            id: 4,
            name: "Brands",
           // slug: "pa_brands",
            options: [Product.manufacturer.name ? Product.manufacturer.name : "N/A"]
        },
        {
            name: 'Html Specs',
            options: [Product.htmlMainSpecs ? Product.htmlMainSpecs : "N/A"]
        },

        {
            name: 'estimate Gross Weight',
            options: [Product.estimateGrossWeight ? Product.estimateGrossWeight : "N/A"]
        },
        {
            name: 'product Model',
            options: [Product.productModel ? Product.productModel : "N/A"]
        },
        {
            name: 'ean',
            options: [Product.ean ? Product.ean : "N/A"]
        },
        {
            name: 'warranty Text',
            options: [Product.warrantyText ? Product.warrantyText : "N/A"]
        },
        {
            name: 'product Type Name',
            options: [Product.productType.name ? Product.productType.name : "N/A"]
        },
        {
            name: 'product Sub Type Id',
            options: [Product.productSubTypeId ? Product.productSubTypeId : "N/A"]
        },
        {
            name: 'product Sub Type',
            options: [Product.productSubType ? Product.productSubType : "N/A"]
        },
    ]
    return attributes
}

module.exports = getAttributes