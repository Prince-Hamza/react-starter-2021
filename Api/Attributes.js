


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


const getStandardHtmlDataSheet = async (link) => {
    
    var resp = await axios.get(link)
    let tableData = resp.data.toString()

    let tableStart = tableData.indexOf('Main features')
    let tableEnd = tableData.lastIndexOf('/td><td></td></tr>') + 19
    let tableInitString = tableData.substring(tableStart, tableEnd)
    let tableString = tableInitString.substring(tableInitString.indexOf(`<tr height=20`), tableInitString.length - 1)
    let tableRows = tableString.split(`<tr height=20>`)
    let nodes = tableRows.map(item => item.split('</td>'))

    let keys = [], values = [], finalPara = ''

    nodes.map((item) => {
        item.map((line, index) => {
            if (line.includes('General')) {
                // finalPara += `<div class=\"ITSg\">General</div>`
            } else {
                if (line.includes('class=h')) {
                    let parseLine = line.substring(line.indexOf('>') + 1, line.length)
                    //console.log(`index : ${index} ___  key : ${parseLine}`)
                    finalPara += `<div class="ITSr1">  <div class= "ITSn"> ${parseLine} </div>`
                }

                if (line.includes('class=b')) {
                    let parseLine = line.substring(line.indexOf('>') + 1, line.length)
                    //console.log(`index : ${index} ___ value: ${parseLine}`)
                    finalPara += `<div class="ITSv" > ${parseLine} </div> </div>`
                }
            }
        })
    })


    finalPara = finalPara.substring(finalPara.indexOf('</div>') + 6, finalPara.length)

    finalPara = `<div id="HTML_SPEC" class="ITSs"><div class="ITSg">General</div>` + finalPara + "</div>"


    console.log(`final Para : ${finalPara}`)
    return finalPara

}

module.exports = getAttributes