const http = require('http');
const fs=require('fs');
const os = require('os');

const obj = {};
const pm2 = require('pm2');
setInterval(function () {
    pm2.describe('pos_web',(err, proc)=> {
        obj.err=err;
        obj.proc=proc;
        const cpus = os.cpus(),
            totalmem = os.totalmem(),
            freemem = os.freemem(),
            loadavg = os.loadavg();
        obj.sysInfo={
            cpus:cpus,
            totalmem:totalmem,
            freemem:freemem,
            loadavg:loadavg
        };
        const postData = JSON.stringify(obj);
        const options = {
            hostname: '192.168.230.128',
            port: 4040,
            path: '/pushInfo',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        const req = http.request(options, (res) => {
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
            });
            res.on('end', () => {
            });
        });
        req.on('error', (e) => {
            console.log(`problem with request: ${e.message}`);
        });

// write data to request body
        req.write(postData);
        req.end();
    });
}, 200);
