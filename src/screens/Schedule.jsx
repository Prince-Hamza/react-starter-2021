
import React, { Component } from "react";
import Settings from "./Settings";
import { Styles } from '../styles/Styles'
import 'firebase/compat/database'

export default class Schedule extends Component {

    constructor(props) {
        super()
        this.state = {
            ResumeFrom: 0,
            cloud: true,
            local: false,
            showSettings: false,
            chooseDevice: true,
            Calendar: false,
            formTop: 15,
        }
    }

    setCloud = (input) => {
        this.setState({ cloud: true, local: false, calendar: true })
    }


    setLocal = (input) => {
        this.setState({ cloud: false, local: true })
    }

    onContinue = (input) => {
        this.state.cloud && this.setState({ showSettings: true, chooseDevice: false, Calendar: true })
        this.state.local && this.props.selectDevice()
    }

    render() {
        return (
            <div style={Styles.Theme} >


                {this.state.chooseDevice && !this.state.Calendar &&
                    <div>
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

                        <button style={{ ...Styles.Button, ...Cards.Continue }} onClick={() => { this.onContinue() }} >
                            Continue
                        </button>

                    </div>
                }

                {this.state.showSettings &&
                    <div>
                        <Settings formTop={this.state.formTop} />
                    </div>
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
        left: '35%',
        width: '30%',
        height: '6.5%',
        color: 'magenta',
        font: 'italic 16px times new roman'
    }
})