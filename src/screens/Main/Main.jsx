import React, { Component } from "react";
import Schedule from '../Schedule'
import axios from "axios";
import { initializeApp } from '@firebase/app'
import { firebaseConfig } from '../config'
import { Styles } from './Styles'
import firebase from 'firebase/compat/app'
import 'firebase/compat/storage'
import { fs } from 'fs'
import Settings from "../Settings";

var ProductCount = 0;


function getstream(res) {
	console.log(res.data)
}

export default class PriceStock extends Component {
	constructor() {
		super()
		this.state = {
			ParallelPros: 10,
			ResumeFrom: 0,
			SendPro: [],
			HoldPro: [],
			HoldCount: -1,
			counter: 0,
			Pause: false,
			SequenceCount: 0,
			catCount: 0,
			exportKey: "",
			NextSequence: true,
			Once: 1,
			ImagesUploaded: 0,
			ImageLinx: [],
			SeqFinish: '',
			Categories: [],
			FormInfo: { Site: 'https://firewallforce.se', priceStock: true, Categories: false, Images: false, Attributes: false },
			firewallRadio: true,
			denmarkRadio: false,
			Updated: 0,
			concurrency: 2,
			Interface: 'Schedule'
		}
	}

	componentDidMount = () => {
		try { initializeApp(firebaseConfig) } catch (ex) { console.log('') }
		// document.getElementById('htmlspec').innerHTML = "<h1> Hello World </h1>"
	}



	initStream = () => {
		var url = `http://localhost:5000/api/stream/${this.state.exportKey}/${this.state.ResumeFrom}/`;
		axios.get(url, { responseType: 'stream' }).then(getstream);
	}




	onProduct = () => {
		//this.state.FormInfo
		this.state.FormInfo['key'] = this.state.exportKey
		this.setState({ FormInfo: this.state.FormInfo })

		const App = this;
		const ws = new WebSocket('ws://localhost:5000/');
		ws.onopen = function () {
			console.log('WebSocket Client Connected');
			ws.send('Message From Client');
			App.initStream()
		};

		ws.onmessage = function (e) {
			App.setState({ counter: App.state.counter + 1 })
			console.log(`Count : ${App.state.counter}`);

			var inputObj = JSON.parse(e.data)
			console.log(`Pro Type First :: ${inputObj}`)

			if (inputObj.hasOwnProperty('Skip')) {
				App.setState({ SequenceCount: App.state.SequenceCount + 1 })
			} else {
				App.state.HoldPro.push(JSON.parse(e.data))
				App.setState({ HoldPro: App.state.HoldPro })
			}

			console.log("going to run:once")
			if (App.state.Once) {
				App.listenApiFlow()
				App.setState({ Once: 0 })
			}
		};

	}

	listenApiFlow = () => {

		setInterval(() => {
			this.ApiFlow()
			console.log('Api Flow')
		}, 1000)

	}

	ApiFlow = () => {

		console.log('Api Flow')
		//console.log(`Hold Pro Length :: ${this.state.HoldPro.length}`)
		console.log(`Next Sequence :: ${this.state.NextSequence}`)

		// if (this.state.HoldPro.length == 0 && this.state.SequenceCount > 99) {
		// 	setTimeout(()=> {
		// 		if (this.state.HoldPro.length == 0 && this.state.SequenceCount > 99) this.setState({ SeqFinish: 'Finished Parsing JSON' })
		// 	},1000 * 180)
		// }


		if (this.state.NextSequence == true && this.state.HoldPro.length >= this.state.concurrency) {

			console.log(`Hold Pro Length >= 25 `)
			console.log(`Send Pro Length on init:: ${this.state.SendPro.length}`)

			for (let n = 0; n <= this.state.concurrency - 1; n++) {
				this.state.SendPro[n] = this.state.HoldPro.shift()
				console.log(`Product ${n} :: ${this.state.SendPro[n]}`)
			}

			this.setState({ HoldPro: this.state.HoldPro, SendPro: this.state.SendPro, NextSequence: false, HoldCount: this.state.HoldPro.length })
			console.log(`Send Pro Length :: ${this.state.SendPro.length}`)
			this.Fetch2(this.state.SendPro)
			this.state.SendPro = []
			this.setState({ SendPro: [] })
		}



	}


	// }

	Fetch2 = async (Pro) => {

		this.setState({ NextSequence: false })
		console.log(`Pro Count :: ${Pro.length}`)
		Pro = this.refineStockPrices(Pro)

		alert(JSON.stringify(this.state.FormInfo))

		var jsonBody = { products: Pro, config: this.state.FormInfo }

		var App = this;

		var config = {
			method: 'post',
			url: 'http://localhost:5000/api/golangserver',
			headers: {
				'Content-Type': 'application/json'
			},
			data: jsonBody
		};

		var resp
		await axios(config)
			.then(function (response) {
				resp = response.data
			})
			.catch(function (error) {
				console.log(error);
			});


		ProductCount += this.state.concurrency;

		console.log(`Products :: ${ProductCount}`)

		App.setState({
			//Updated: this.state.Updated + jsnArray[jsnArray.length - 1].updated,
			SequenceCount: this.state.SequenceCount + this.state.concurrency,
			NextSequence: true
		})

	}


	refineStockPrices = (Products) => {
		Products.map((product) => {
			if (!product.hasOwnProperty('supplierPriceInfo')) {
				product.supplierPriceInfo = { price: 0 }
			}
			if (!product.hasOwnProperty('supplierStockInfo')) {
				product.supplierPriceInfo = { price: 0 }
				product.supplierStockInfo = { stock: 0, stockStatusText: "Not Available" }
			}

			product.fields_in_response = ['id', 'sku', 'stock']
			product.type = 'simple'
		})

		return Products
	}

	getRespArray = (Jsn) => {
		var array = []
		Jsn.forEach((item) => {
			array.push(item)
		})
		return array
	}

	saveCount = (count) => {
		fs.appendFileSync('saveCount.json', { count: count })
	}


	reupdate = (respJson) => {


		console.log(`reupdate: respJson Length :: ${respJson.length}`)
		console.log(`respJson 0 type :: ${typeof respJson[0]}`)
		console.log(`has Files :: ${respJson[0].hasOwnProperty('Files')}`)

		// if (respJson[0].hasOwnProperty('Files')) this.FireNeatify(respJson[0].Files)
		// if (respJson[1].hasOwnProperty('Files')) this.FireNeatify(respJson[1].Files)
		// if (respJson[2].hasOwnProperty('Files')) this.FireNeatify(respJson[2].Files)
		// if (respJson[3].hasOwnProperty('Files')) this.FireNeatify(respJson[3].Files)
		// if (respJson[4].hasOwnProperty('Files')) this.FireNeatify(respJson[4].Files)

		for (let n = 0; n <= 5; n++) {
			if (respJson[n].hasOwnProperty('Files')) this.FireNeatify(respJson[n].Files)
		}


	}



	FireNeatify = (Files) => {

		var storageRef = firebase.storage().ref()

		try {
			Files.forEach((FilePath) => {
				var imageRef = storageRef.child(FilePath);
				imageRef.delete().then(() => {
					console.log('File deleted successfully')
				}).catch((error) => {
					console.log('Uh oh, an error occurred!' + error)
				});
			})

		} catch (ex) {
			console.log('')
		}


	}





	getRandom = (min, max) => {
		return Math.trunc(Math.random() * (max - min) + min);
	}


	getIndex(string, subString, index) {
		return string.split(subString, index).join(subString).length;
	}

	handleResume = (e) => {
		this.setState({ ResumeFrom: e.target.value })
	}

	setSite = (site) => {
		this.state.FormInfo.Site = site
		this.setState({ FormInfo: this.state.FormInfo })
	}

	radioChange = (site) => {
		var firewallRadioValue = (site == 'fire') ? true : false
		var denmarkRadioValue = (site == 'den') ? true : false
		this.state.FormInfo.Site = (site == 'fire') ? 'https://firewallforce.se' : 'denmark'

		this.setState({
			FormInfo: this.state.FormInfo,
			firewallRadio: firewallRadioValue,
			denmarkRadio: denmarkRadioValue
		})
	}

	setValue = (param) => {
		this.state.FormInfo[param] = !this.state.FormInfo[param]
		this.setState({ FormInfo: this.state.FormInfo })
	}

	deviceSelect = () => {
		this.setState({ Interface: 'Local' })
	}

	handleFormUpdate = (FormInfo) => {
		this.setState({ FormInfo: FormInfo })
	}

	render() {
		if (this.state.Interface == 'Local') {

			return (
				<div style={Styles.Theme} >
					{/* <input type="file" onChange={(e) => { this.getFileContext(e) }} />
				<h5> {this.state.progressInstance} </h5> */}

					<input type="text" style={Styles.inputBox} placeholder="      Export Key" value={this.state.exportKey}
						onChange={(e) => { this.setState({ exportKey: e.target.value }) }} />

					<button style={Styles.Button} onClick={() => { this.onProduct() }} >Start</button>
					<h5> {this.state.SeqFinish} </h5>

					<div style={Styles.Circle}>
						<div>	{this.state.SequenceCount}	</div>
						<p style={{ font: 'bold 12px times new roman' }} >	analyzed </p>
					</div>

					<div style={Styles.Circle2}>
						<div>	{this.state.Updated}	</div>
						<p style={{ font: 'bold 12px times new roman' }} >	updated </p>
					</div>



					<Settings formTop={60} Main={true} onFormUpdate={this.handleFormUpdate} />



					{/* 
				<div style={{width:'100%' , height:"25px" , backgroundColor:"white"}} id = "htmlspec" >

				</div> */}


				</div>
			)
		} else if (this.state.Interface == 'Schedule') {
			return (
				<Schedule selectDevice={this.deviceSelect} />
			)
		}
	}

}

