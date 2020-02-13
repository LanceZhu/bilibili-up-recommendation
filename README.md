# bilibili up recomendation

## Intro

通过爬取用户在 [bilibili](http://bilibili.com/) 的关注者及其关注者的关注者及关注者的...，获取共同关注数较多的 up 主来推荐可能感兴趣的 up 主

## Quick Start

``` shell
git clone git@github.com:LanceZhu/bilibili-up-recomendation.git
cd bilibili-up-recomendation // 切换到目录

npm install // 安装依赖

node ./utils/initialize.js user_id // https://space.bilibili.com/322892 user_id 即为 322892。初始化，防止程序意外终止，在 process 文件夹中保存进度

node ./index.js user_id // 启动

python ./analyzer/top100.py user_id // 获取用户关注者 top100 关注用户
```

## 其他

### proxy_pool

通过 [proxy_pool](https://github.com/jhao104/proxy_pool) 获取代理

 http://118.24.52.95

 ``` javascript
 请求方式说明
 {
    delete?proxy=127.0.0.1:8080: "delete an unable proxy",
    get: "get an useful proxy",
    get_all: "get all proxy from proxy pool",
    get_status: "proxy number"
}
 ```