const config = require('./config')
const fetch = require('node-fetch')
const firebase = require('firebase/compat/app').default
require("firebase/compat/database");

class Prices {

    getFinalPrice = async (Product) => {


        try { firebase.initializeApp(config) } catch (ex) { }

        const inputPrice = this.selectInput(Product)
        console.log(`inputPrice :: ${inputPrice}`)
        var price = await this.currencyExchange(inputPrice)
        // console.log(`Final Price :: ${price}`)
        var intPrice = parseFloat(price)
        var priceByMargin = intPrice + ((intPrice / 100) * 20);
        var roundPrice = priceByMargin.toFixed(2) + ""
        return roundPrice
    }

    selectInput(Product) {
        var Price = 0
        Price = (Product.hasOwnProperty('productPriceInfo')) ? Product.productPriceInfo.price : Price
        Price = (Product.hasOwnProperty('supplierPriceInfo')) ? Product.supplierPriceInfo.price : Price
        return Price
    }

    currencyExchange = async (Eur) => {

        const FireData = await firebase.database().ref('/CurrencyApi').once('value')
        var Fireval = FireData.val()
        // console.log(`Firebase currency Api Reponse :: ${Fireval} `)

        var nowDate = new Date();
        var date = nowDate.getFullYear() + '/' + (nowDate.getMonth() + 1) + '/' + nowDate.getDate();
        // console.log(`now Date :: ${date}`)
        // console.log(`fireval Date :: ${Fireval.Date}`)

        var Method = (date === Fireval.Date) ? this.priceByFire : this.useCurrencyResp
        var Final = await Method(Fireval.Info, Eur)
        console.log(Final)
        return Final
    }

    priceByFire(cinf, Eur) {
        console.log('priceByFire')
        // console.log(`Rates : ${cinf.rates}`)

        var EurInApi = cinf.rates.EUR;
        console.log(EurInApi)
        var intEur = EurInApi + 0;
        var cnvbase = 1 / intEur; // Eur * by cnvbase = usd value 
        // console.log(`cnvbase :: ${cnvbase}`)

        var USdollar = Eur * cnvbase;
        // console.log(`USDollar : ${USdollar}`)
        var SEK = cinf.rates.SEK;
        var Krona = USdollar * SEK;
        // console.log(`Krona : ${Krona}`)
        return Krona.toString()
    }

    async useCurrencyResp(cinf, Eur) {
        // console.log('currency Resp')

        const cExRate = await fetch('https://currencyapi.net/api/v1/rates?key=McRbxJQKvXlfe5D6EHIv2Q8qtSxTD37zEq9m&output=JSON');
        cinf = await cExRate.json();

        var nowDate = new Date();
        var date = nowDate.getFullYear() + '/' + (nowDate.getMonth() + 1) + '/' + nowDate.getDate();

        firebase.database().ref('/CurrencyApi').set({
            Info: cinf,
            Date: date
        })

        var EurInApi = cinf.rates.EUR;
        var intEur = EurInApi + 0;
        var cnvbase = 1 / intEur; // Eur * by cnvbase = usd value 
        var USdollar = Eur * cnvbase;
        var SEK = cinf.rates.SEK;
        var Krona = USdollar * SEK;
        return Krona.toString()

    }

    async Once(Ref) {
        console.group('once r fire')
        try {
            const info = await firebase.database().ref(Ref).once('value')
            console.log(`fireback : ${info}`)
            return info

        } catch (ex) {
             console.log(`firerror : ${ex}`)
        }



    }


}

const priceInfo = new Prices()

module.exports = priceInfo