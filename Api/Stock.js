

class Stock {

    prepareStock(Product) {
        const stockQuantity = this.getStockQuantity(Product)
        const stockStatus = this.getStockStatus(Product)
        const itScopeStatus = this.getItScopeStockStatus(Product)
        return ({ stockQuantity: stockQuantity, wpStockStatus: stockStatus, itScopeStockStaus: itScopeStatus })
    }

    getStockQuantity(Product) {
        var stockQuantity = undefined
        if (Product.hasOwnProperty('supplierStockInfo')) stockQuantity = Product.supplierStockInfo.stock
        if (Product.hasOwnProperty("productStockInfo")) stockQuantity = Product.productStockInfo.stock
        if (!stockQuantity) stockQuantity = Product.aggregatedStockStatus
        if (!stockQuantity) stockQuantity = 0

        return stockQuantity
    }

    getStockStatus(Product) {
        const statusList = ["Soon", "In stock", "Order-based", "external"]
        var stockStatus = undefined

        statusList.map((status) => {
            if (Product.hasOwnProperty('supplierStockInfo')) {
                if (Product.supplierStockInfo.stockStatusText.includes(status)) stockStatus = "instock"
            }
        })

        statusList.map((status) => {
            if (Product.hasOwnProperty('productStockInfo')) {
                if (Product.productStockInfo.stockStatusText.includes(status)) stockStatus = "instock"
            }
        })

        if (stockStatus == undefined) stockStatus = "outofstock"

        return stockStatus
    }

    getItScopeStockStatus(Product) {
        var itScopeStatus = "unknown"
        if (Product.hasOwnProperty('supplierStockInfo')) itScopeStatus = Product.supplierStockInfo.stockStatusText
        if (Product.hasOwnProperty('productStockInfo')) itScopeStatus = Product.productStockInfo.stockStatusText

        return itScopeStatus
    }

}

const stockInfo = new Stock()
module.exports = {
    stockInfo
}
