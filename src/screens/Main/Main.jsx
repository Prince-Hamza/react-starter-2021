import React, { Component } from "react";
import axios from "axios";
import { initializeApp } from '@firebase/app'
import { firebaseConfig } from '../config'
import { Styles } from './Styles'
import firebase from 'firebase/compat/app'
import 'firebase/compat/storage'
import { fs } from 'fs'

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
			Updated: 0
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


		if (this.state.NextSequence == true && this.state.HoldPro.length >= 2) {

			console.log(`Hold Pro Length >= 25 `)
			console.log(`Send Pro Length on init:: ${this.state.SendPro.length}`)

			for (let n = 0; n <= 1; n++) {
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


		var jsonBody = { products: Pro }

		var App = this;

		var config = {
			method: 'post',
			url: 'http://localhost:5000/api/golangserver',
			headers: {
				'Content-Type': 'application/json'
			},
			data: jsonBody
		};

		alert("sending Request")

		await axios(config)
			.then(function (response) {
				alert(JSON.stringify(response.data));
			})
			.catch(function (error) {
				alert(error);
			});



		// const resp = await axios.post('https://us-central1-my-first-project-ce24e.cloudfunctions.net/UpdateFirewallForce',
		// 	{ info: Pro, categories: this.state.Categories, pronum: this.state.ParallelPros, Select: this.state.FormInfo },
		// 	{
		// 		headers: { 'content-type': 'application/json' },
		// 		timeout: 0
		// 	},
		// )
		// var respJson = await resp.data
		// var jsnArray = respJson.info


		ProductCount += 2;

		console.log(`Products :: ${ProductCount}`)

		App.setState({
			//Updated: this.state.Updated + jsnArray[jsnArray.length - 1].updated,
			SequenceCount: this.state.SequenceCount + 2,
			NextSequence: true
		})

	}


	refineStockPrices = (Products) => {
		Products.map((product) => {
			if (product.hasOwnProperty('productPriceInfo') == false && product.hasOwnProperty('supplierPriceInfo') == false) {
				product.productPriceInfo = { price: 0 }
			}
			if (product.hasOwnProperty('productStockInfo') == false && product.hasOwnProperty('supplierStockInfo') == false && product.hasOwnProperty("aggregatedStock") == false) {
				product.productStockInfo = { stock: 0 }
			}
			if (product.hasOwnProperty('productStockInfo') == false && product.hasOwnProperty('supplierStockInfo') == false && product.hasOwnProperty("aggregatedStockStatusText") == false) {
				product.productStockInfo = { stock: 0, stockStatusText: "Not Available" }
			}
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

	render() {
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




				<div style={Styles.Form}>

					<div style={Styles.Card} >
						<input type="radio" style={Styles.Left} checked={this.state.firewallRadio} onChange={() => { this.radioChange('fire') }} />
						<p style={Styles.Right} > Firewallforce </p>
					</div>

					<div style={Styles.Card} >
						<input type="radio" style={Styles.Left} checked={this.state.denmarkRadio} onChange={() => { this.radioChange('den') }} />
						<p style={Styles.Right} > Denmark.com </p>
					</div>
					{/* 
				<div style= {Styles.Card} >
					<input type="checkbox" checked={this.state.FormInfo.priceStock} style={Styles.Left} onChange={()=> {this.setValue('priceStock')}} />
					<p style={Styles.Right}> Prices & Stock </p> 
						</div>


				<div style= {Styles.Card} >
				<input type="checkbox" style={Styles.Left} checked={this.state.FormInfo.Categories} onChange={()=> this.setValue('Categories')} />
					<p style={Styles.Right} > Category </p> 
				</div>

				<div style= {Styles.Card} >
					<input type="checkbox" style={Styles.Left} checked={this.state.FormInfo.Images} onChange={()=> {this.setValue('Images')}} />
					<p style={Styles.Right} > Images </p> 
				</div>

				<div style= {Styles.Card} >
					<input type="checkbox" style={Styles.Left} checked={this.state.FormInfo.Attributes} onChange={()=>{this.setValue('Attributes')}} />
					<p style={Styles.Right} > Attributes </p> 
				</div> */}

					<div style={{ ...Styles.Card, flexDirection: 'column', alignItems: 'center' }} >
						<p style={{ ...Styles.Left, color: 'magenta' }} > Resume From Here </p>
						<input type='number' style={{ ...Styles.ResumeInput }} value={this.state.ResumeFrom} onChange={(e) => { this.handleResume(e) }} />
					</div>
				</div>


				{/* 
				<div style={{width:'100%' , height:"25px" , backgroundColor:"white"}} id = "htmlspec" >

				</div> */}


			</div>
		)
	}

}

