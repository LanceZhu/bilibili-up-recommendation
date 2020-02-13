const axios = require('axios')
const fs = require('fs')

const log = require('./utils/log')
const sleep = require('./utils/sleep')
const getProxy = require('./utils/proxy')

/**
 * 根据用户 id 获取其关注者列表
 * @param {Number} mid 
 * @return {Array} 关注者列表
 */
async function getFollowing(mid, proxy){
    let options = {}
    let host, port
    if(proxy !== undefined){
        [host, port] = proxy.split(':')
        options['proxy'] = {
            host,
            port
        }
    }

    let followingList = []

    let retry = 5 // 错误重新请求
    let flag = false
    let totalFollowingNum
    while(retry >= 0 && !flag){
        try{
            let res = await axios.get(`https://api.bilibili.com/x/relation/followings?vmid=${mid}&pn=1&ps=50`, options)
            if(res.data.code !== 0) throw new Error(res)
            flag = true

            totalFollowingNum = res.data.data.total
            log(`${mid} remain: ${totalFollowingNum}`)
            followingList.push(...res.data.data.list)
            totalFollowingNum -= res.data.data.list.length
            log(`${mid} remain: ${totalFollowingNum}`)
        }catch(err){
            log(err)
            retry--
            await sleep(5000 * Math.random())
        }
    }


    let pn = 2
    while(totalFollowingNum > 0 && pn <= 5){ // 最多爬取五页
        retry = 5
        flag = false
        while(retry >=0 && !flag){
            try{
                let res = await axios.get(`https://api.bilibili.com/x/relation/followings?vmid=${mid}&pn=${pn}&ps=50`, options)
                if(res.data.code !== 0) throw new Error(res)
                flag = true

                followingList.push(res.data.data.list)
                totalFollowingNum -= res.data.data.list.length
                log(`${mid} remain: ${totalFollowingNum}`)
            }catch(err){
                log(err)
                retry--
                await sleep(5000 * Math.random())
            }
        }
        await sleep(5000 * Math.random())
        pn++
    }

    return followingList
}

/**
 * 将用户名列表写入文件
 * @param {Array} list 
 */
function appendFile(list, filename){
    list.forEach(el => {
        fs.appendFileSync(filename, el.uname)
        fs.appendFileSync(filename, '\n')
    })  
}

function persistProcess(mid, ups, mids, head){
    let preUps = JSON.parse(fs.readFileSync(`./process/${mid}/${mid}_ups.txt`))
    let preMids = JSON.parse(fs.readFileSync(`./process/${mid}/${mid}_mids.txt`))
    let preHead = JSON.parse(fs.readFileSync(`./process/${mid}/${mid}_head.txt`))
    fs.writeFileSync(`./process/${mid}/${mid}_pre_ups.txt`, JSON.stringify(preUps))
    fs.writeFileSync(`./process/${mid}/${mid}_pre_mids.txt`, JSON.stringify(preMids))
    fs.writeFileSync(`./process/${mid}/${mid}_pre_head.txt`, JSON.stringify(preHead))

    fs.writeFileSync(`./process/${mid}/${mid}_ups.txt`, JSON.stringify(ups))
    fs.writeFileSync(`./process/${mid}/${mid}_mids.txt`, JSON.stringify(mids))
    fs.writeFileSync(`./process/${mid}/${mid}_head.txt`, JSON.stringify(head))
}


/**
 * 
 * @param {number} mid 用户 id
 * @param {number} times 滚动次数 times=1 表示只爬取个人关注用户，times=2 表示爬取个人关注用户+个人关注者关注用户
 */
async function entry(mid, times){
    let ups = JSON.parse(fs.readFileSync(`./process/${mid}/${mid}_pre_ups.txt`))
    let mids = JSON.parse(fs.readFileSync(`./process/${mid}/${mid}_pre_mids.txt`))
    let head = JSON.parse(fs.readFileSync(`./process/${mid}/${mid}_pre_head.txt`))
    const filename = `./data/${mid}.txt`
    // // let proxies = await getProxy(4)
    // let proxies = [
    //     '121.40.119.149:3128',
    //     '39.137.95.70:80',
    //     '39.137.69.8:8080',
    //     '37.187.116.199:80'
    // ]

    while(head < mids.length){
        log(`爬取进度：${head} / ${mids.length}`)
        let _mid = mids[head]

        head++

        if(_mid.times >= times){
            break
        }

        if(ups[_mid.mid] !== undefined){
            log(`${_mid.mid} 已抓取`)
            continue
        }else{
            ups[_mid.mid] = true
        }

        let list = await getFollowing(_mid.mid)
        let tmpMids = list.map(el => {
            return {
                mid: el.mid,
                times: _mid.times + 1
            }
        })
        mids.push(...tmpMids)
        appendFile(list, filename)
        persistProcess(mid, ups, mids, head)
    }
}

(async () => {
    await entry(process.argv[2], 3)
})()
