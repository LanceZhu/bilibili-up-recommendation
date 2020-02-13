const fs = require('fs')

const filename = `./logs/log_${new Date().valueOf()}.txt`

function log(message){
    console.log(message)
    fs.appendFileSync(filename, `${(new Date()).valueOf()} ${message}`)
    fs.appendFileSync(filename, '\n')
}

module.exports = log