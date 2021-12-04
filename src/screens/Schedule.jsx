
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
            ResumeFrom: 0,
            cloud: true,
            local: false,
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

                <div style={{ ...Styles.Form, ...Cards.Main }}>
                    <div style={{ ...Styles.Card, height: '100%' }} >
                        <input type="radio" style={Styles.Left} checked={this.state.cloud} onChange={() => { this.setCloud() }} />
                        <p style={Styles.Right} > Cloud Device </p>
                    </div>
                </div>

                <div style={{ ...Styles.Form, ...Cards.Main, top: '40%' }}>
                    <div style={{ ...Styles.Card, height: '100%' }} >
                        <input type="radio" style={Styles.Left} checked={this.state.local} onChange={() => { this.setLocal() }} />
                        <p style={Styles.Right} > Local Device </p>
                    </div>
                </div>


                <button style={{ ...Styles.Button, ...Cards.Continue }} onClick={() => { this.props.deviceSelect() }} >
                    Continue
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
        left: '35%',
        width: '30%',
        height: '6.5%',
        color: 'magenta',
        font: 'italic 16px times new roman'
    }
})