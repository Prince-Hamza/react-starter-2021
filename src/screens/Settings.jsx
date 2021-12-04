
import React, { Component } from "react";
import axios from "axios";
import { initializeApp } from '@firebase/app'
import { Styles } from '../styles/Styles'
import firebase from 'firebase/compat/app'
import 'firebase/compat/database'


export default class Settings extends Component {

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

    setCloud = (input) => {
        this.setState({ cloud: true, local: false })
    }


    setLocal = (input) => {
        this.setState({ cloud: false, local: true })
    }

    render() {
        return (
            <div style={Styles.Theme} >


                <div style={Styles.Form}>

                    <div style={Styles.Card} >
                        <input type="radio" style={Styles.Left} checked={this.state.firewallRadio} onChange={() => { this.radioChange('fire') }} />
                        <p style={Styles.Right} > Firewallforce </p>
                    </div>

                    <div style={Styles.Card} >
                        <input type="radio" style={Styles.Left} checked={this.state.denmarkRadio} onChange={() => { this.radioChange('den') }} />
                        <p style={Styles.Right} > Denmark.com </p>
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
    }
})