const fs = require('fs')
const axios = require('axios').default


class ubuntuVM {

    constructor() {
        this.Store = []
        this.storeSection = []
        this.concurrency = 2
        this.Next = true
        this.config = {}
    }

    initStream = (config) => {
        this.config = config
        console.log(`vm config key : ${config.key}`)
        var url = `http://localhost:5000/api/stream/${config.key}/0/`;
        axios.get(url, { responseType: 'stream' }).then(() => { return })
    }

    onProduct = (product) => {

        console.log(`on Product : ${product}`)
        this.Store.push(product)

        if (this.Store.length >= this.concurrency && this.Next) {

            for (let x = 1; x <= 2; x++) {
                console.log("push")
                this.storeSection.push(this.Store.shift())
            }

            console.log(`store length : ${this.storeSection.length}`)
            this.updateFirewallForce(this.storeSection)
            this.storeSection = []
        }
    }

    updateFirewallForce = async (productsArray) => {

        this.Next = false
        var jsonBody = { products: productsArray }

        var config = {
            method: 'post',
            url: 'http://localhost:5000/api/golangserver',
            headers: {
                'Content-Type': 'application/json'
            },
            data: jsonBody
        }

        var resp = await axios(config)
        console.log(resp.data)
        this.Next = true

    }




}

module.exports = new ubuntuVM()