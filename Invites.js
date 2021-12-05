const axios = require('axios').default
const fs = require('fs')
class Invites {

    constructor() {
        this.GAPSUri = 'https://script.google.com/macros/s/AKfycbzusiOC3ZAbKow8DbRqI-6TNeRvrpTPcvPixCVILrG_FNXYH5gKj72IkVD6qwtrpXzf/exec'
    }

    sendEmail = (emailAddress, Message, Subject) => {
        return axios.get(this.GAPSUri, {
            params: { Email: emailAddress, Message: Message, Subject: Subject },
        })
            .then((res) => {
                console.log(res.data);
                fs.appendFileSync('./error.txt', res.data)
            }).catch((err) => {
                console.log(`email error : ${err}`)
                fs.appendFileSync('./error.txt', err)
            })
    }

    Notify = () => {

    }

    ShareOnSocialMedia = () => {

    }

}

module.exports = new Invites()