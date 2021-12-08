
import React, { Component } from "react";
import axios from "axios";
import $ from 'jquery'
import { config } from "../config";
import { Styles } from '../styles/Styles'
import firebase from 'firebase/compat/app'
import 'firebase/compat/database'
import request from "request";


export default class Settings extends Component {

    constructor(props) {
        super()
        this.state = {
            ParallelPros: 10,
            ResumeFrom: 0,
            FormInfo: { create: false, update: false, key: '', Site: 'https://firewallforce.se', title: false, description: false, priceStock: false, Categories: false, Images: false, Attributes: false },
            seRadio: false,
            dkRadio: false,
            pkRadio: false,
            Key: '',
            overlayer: false,
            commands: 1
        }
    }


    radioChange = (input) => {
        this.state.FormInfo.Site = `https://firewallforce.${input}`
        this.setState({
            FormInfo: this.state.FormInfo,
            [`${input}Radio`]: true,
        })
    }


    setValue = (param) => {
        this.state.FormInfo[param] = !this.state.FormInfo[param]
        this.setState({ FormInfo: this.state.FormInfo })
        this.props.Main && this.props.onFormUpdate(this.state.FormInfo)
    }


    setExportKey = (key) => {
        this.state.FormInfo.key = key
        this.setState({ FormInfo: this.state.FormInfo })
    }

    onSchedule = async () => {
        this.setState({ overlayer: true })
        $(window).scrollTop(0)

        // set form info in the database
        this.setVmConfig()

        // set default project powershell
        await axios.post('http://localhost:5000/api/vmstart', { command: 'gcloud config set project my-first-project-ce24e' })
        this.setState({ commands: this.state.commands + 1 })


        // execute command to start ubuntu vm

        await axios.post('http://localhost:5000/api/vmstart', { command: 'gcloud compute instances start ubuntuvm --zone=asia-south2-a' })
        this.setState({ commands: this.state.commands + 1 })


        // vm startup script will automatically start the projet & notify
    }


    setVmConfig = async () => {
        try { firebase.initializeApp(config) } catch (ex) { return }

        return await firebase.database().ref('/vmConfig').set({
            key: this.state.FormInfo.key,
            priceStock: this.state.FormInfo['priceStock'],
            titles: this.state.FormInfo['title'],
            descriptions: this.state.FormInfo['description'],
            categories: this.state.FormInfo['Categories'],
            attributes: this.state.FormInfo['Attributes'],
            images: this.state.FormInfo['Images'],
            update: true,
            create: false,
        })
    }


    render() {
        return (
            <div style={Styles.Theme} >

                {this.state.overlayer &&
                    <div style={Cards.Overlayer} >
                        <div style={Cards.DarkCard}>
                            {this.state.commands >= 1 && <h3 style={{ color: 'white' }} > Logging In to Google Cloud </h3>}
                            {this.state.commands >= 2 && <h3 style={{ color: 'white' }} > Default Google Cloud Project Settled </h3>}
                            {this.state.commands >= 3 && <h3 style={{ color: 'white' }} > Google Cloud Device Started </h3>}
                            {this.state.commands >= 3 && <h3 style={{ color: 'white' }} > Success ! You will be notified when project starts </h3>}
                        </div>
                    </div>
                }

                <div style={{ zIndex: 0 }} >

                    {!this.props.Main &&
                        <div style={{ ...Cards.keyStyle }} >
                            <p style={Styles.Right} > key </p>
                            <input type="text" style={Styles.Left} onChange={(e) => { this.setExportKey(e.target.value) }} />
                        </div>
                    }


                    <div style={{ ...Styles.Form, top: this.props.formTop + '%', height: '115%', width: '40%' }} >

                        <div style={Styles.Card} >
                            <input type="radio" style={Styles.Left} checked={this.state.seRadio} onChange={() => { this.radioChange('se') }} />
                            <p style={Styles.Right} > Firewallforce.se </p>
                        </div>


                        <div style={Styles.Card} >
                            <input type="radio" style={Styles.Left} checked={this.state.dkRadio} onChange={() => { this.radioChange('dk') }} />
                            <p style={Styles.Right} > Firewallforce.dk </p>
                        </div>


                        <div style={Styles.Card} >
                            <input type="radio" style={Styles.Left} checked={this.state.pkRadio} onChange={() => { this.radioChange('pk') }} />
                            <p style={Styles.Right} > Firewallforce.pk </p>
                        </div>


                        <div style={Styles.Card} >
                            <input type="checkbox" checked={this.state.FormInfo.create} style={Styles.Left} onChange={() => { this.setValue('create') }} />
                            <p style={Styles.Right}> Create </p>
                        </div>


                        <div style={Styles.Card} >
                            <input type="checkbox" checked={this.state.FormInfo.update} style={Styles.Left} onChange={() => { this.setValue('update') }} />
                            <p style={Styles.Right}> Update </p>
                        </div>


                        <div style={Styles.Card} >
                            <input type="checkbox" checked={this.state.FormInfo.title} style={Styles.Left} onChange={() => { this.setValue('title') }} />
                            <p style={Styles.Right}> Titles </p>
                        </div>

                        <div style={Styles.Card} >
                            <input type="checkbox" checked={this.state.FormInfo.description} style={Styles.Left} onChange={() => { this.setValue('description') }} />
                            <p style={Styles.Right}> Desription </p>
                        </div>


                        <div style={Styles.Card} >
                            <input type="checkbox" checked={this.state.FormInfo.priceStock} style={Styles.Left} onChange={() => { this.setValue('priceStock') }} />
                            <p style={Styles.Right}> Prices & Stock </p>
                        </div>


                        <div style={Styles.Card} >
                            <input type="checkbox" style={Styles.Left} checked={this.state.FormInfo.Categories} onChange={() => this.setValue('Categories')} />
                            <p style={Styles.Right} > Category </p>
                        </div>

                        <div style={Styles.Card} >
                            <input type="checkbox" style={Styles.Left} checked={this.state.FormInfo.Images} onChange={() => { this.setValue('Images') }} />
                            <p style={Styles.Right} > Images </p>
                        </div>

                        <div style={Styles.Card} >
                            <input type="checkbox" style={Styles.Left} checked={this.state.FormInfo.Attributes} onChange={() => { this.setValue('Attributes') }} />
                            <p style={Styles.Right} > Attributes </p>
                        </div>

                        <div style={{ ...Styles.Card, flexDirection: 'column', alignItems: 'center' }} >
                            <p style={{ ...Styles.Left, color: 'magenta' }} > Resume From Here </p>
                            <input type='number' style={{ ...Styles.ResumeInput }} value={this.state.ResumeFrom} onChange={(e) => { this.handleResume(e) }} />
                        </div>
                    </div>
                </div>

                {!this.props.Main &&
                    <button style={{ ...Styles.Button, ...Cards.Continue, top: this.props.formTop + 120 + '%' }} onClick={() => { this.onSchedule() }} >
                        Schedule
                    </button>
                }

            </div>
        )
    }
}


const Cards = ({
    Main: {
        top: '5%',
        left: '25%',
        width: '50%',
        height: '30%'
    },
    Continue: {
        position: 'absolute',
        top: '75%',
        left: '36%',
        width: '30%',
        height: '6.5%',
        color: 'magenta',
        font: 'italic 16px times new roman'
    },
    keyStyle: {
        position: 'absolute',
        top: '3%',
        left: '33%',
        height: '9%',
        width: '40%',
        backgroundColor: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: '0px 0px 8px 1px lightgray'
    },
    Overlayer: {
        position: 'absolute',
        top: '0%',
        left: '0%',
        height: '1000%',
        width: '100%',
        zIndex: 1,
        background: 'rgb(198,189,189)',
        background: 'linear-gradient(90deg, rgba(198,189,189,0.76234243697479) 0%, rgba(189,175,175,0.76234243697479) 100%)'
    },
    DarkCard: {
        position: 'absolute',
        top: '1.5%',
        left: '28%',
        height: '7.5%',
        width: '50%',
        backgroundColor: '#222',
        boxShadow: '0px 0px 8px 4px black'
    }
})


