# logPlatform

####Start App
```
  npm install
  npm run build
  pm2 start pm.json
```
###技术栈
webpack+es6+react+node+express+less
在服务器上使用pm2作为进程管理器，利用pm2的API来对应用进行监控

要被监控的应用需要在app.js里引入logs.js（放在src里）