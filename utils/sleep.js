const log = require('./log')

function sleep(ms){
    log(`sleep ${ms} ms`)
    return new Promise((resolve)=>setTimeout(resolve,ms));
}

module.exports = sleep