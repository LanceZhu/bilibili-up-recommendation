const fs = require('fs')

const mid = process.argv[2]
console.log(`mid: ${mid}`)

fs.mkdirSync(`./process/${mid}`)

fs.writeFileSync(`./process/${mid}/${mid}_ups.txt`, JSON.stringify({}))
fs.writeFileSync(`./process/${mid}/${mid}_mids.txt`, JSON.stringify([{
    mid,
    times: 0
}]))
fs.writeFileSync(`./process/${mid}/${mid}_head.txt`, JSON.stringify(0))

fs.writeFileSync(`./process/${mid}/${mid}_pre_ups.txt`, JSON.stringify({}))
fs.writeFileSync(`./process/${mid}/${mid}_pre_mids.txt`, JSON.stringify([{
    mid,
    times: 0
}]))
fs.writeFileSync(`./process/${mid}/${mid}_pre_head.txt`, JSON.stringify(0))
