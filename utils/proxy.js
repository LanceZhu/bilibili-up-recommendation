const axios = require('axios');
const sleep = require('./sleep')

async function getProxy(num){
    let proxies = []
    while(proxies.length < num){
        let res = await axios.get('http://118.24.52.95/get')
        let proxy = res.data.proxy
        let [host, port] = proxy.split(':')
        try{
            let res = await axios.get('http://baidu.com', {
                proxy: {
                    host,
                    port
                }
            })
            // console.log(proxy)
            proxies.push(proxy)
        }catch(err){
            console.log('代理不可用：', proxy)
        }
        await sleep(1000 * 30)
    }
    return proxies
}

// (async () => {
//     console.log(await getProxy(4))
// })()

module.exports = getProxy
