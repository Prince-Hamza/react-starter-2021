const StartVm = (req, res) => {

    console.log("vm request start")
    const execSync = require('child_process').execSync;
    const output = execSync(req.body.command)
    console.log('Output was:\n', output)
    res.send(output)


    // gcloud auth application-default login --project my-first-project-ce24e
    // gcloud auth login 
    // gcloud config set project projectId

}


module.exports = {
    StartVm
}