
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
            FormInfo: { Site: 'https://firewallforce.se', priceStock: false, Categories: false, Images: false, Attributes: false },
            seRadio: false,
            dkRadio: false,
            pkRadio: false
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
    }

    render() {
        return (
            <div style={Styles.Theme} >


                <div style={{ ...Styles.Form, top: '90%', height: '100%' }} >

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


                <button style={{ ...Styles.Button, ...Cards.Continue, top: '195%' }} onClick={() => { alert(JSON.stringify(this.state.FormInfo)) }} >
                    Schedule
                </button>
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