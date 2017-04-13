# logPlatform
>项目基于express+react+webpack+less,并使用pm2来管理进程。
##使用方法：
开发环境
```
npm install
npm run build
npm run dev
```
生产环境
```
pm2 start pm2.json
```
需要监控的应用在app.js里引入以下代码：
```
var obj = {};
var pm2 = require('pm2');
setInterval(function () {
    pm2.describe('pos_admin',(err, proc)=> {
        obj = {err: err, proc: proc};
        var postData = JSON.stringify(obj);
        var options = {
            hostname: process.env.HOST,
            port: 4040,
            path: '/pushInfo',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        var req = http.request(options, (res) => {
            console.log(`STATUS: ${res.statusCode}`);
            console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                console.log(`BODY: ${chunk}`);
            });
            res.on('end', () => {
                console.log('No more data in response.');
            });
        });
        req.on('error', (e) => {
            console.log(`problem with request: ${e.message}`);
        });

// write data to request body
        req.write(postData);
        req.end();
    });
}, 1000);
```

##原理
利用了pm2的api来获取各个进程。让被监控的应用定时发送进程的信息给日志平台，并以此为基础做心跳。另外使用了node的os模块来获取环境的一些参数。