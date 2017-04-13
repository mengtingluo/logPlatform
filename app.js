require('node-jsx').install(); //enable use jsx in express
require('./middleware/ignore'); //ignore css
const querystring = require('querystring');
var fs = require("fs");
var bodyParser = require('body-parser');
var readline = require('readline');

var path = require('path'),
    express = require('express'),
    jsdom = require('jsdom').jsdom,
    favicon = require('serve-favicon'),
    logger = require('morgan'),
// var cookieParser = require('cookie-parser');
// var bodyParser = require('body-parser');
    routes = require('./routes/index.js'),
    fileRoute = require('./routes/file.js'),
    app = express(),
    multer = require('multer');
// set env
var env = process.env.NODE_ENV || '';
app.set('env', env);
app.locals.env = env;
// if(app.get('env')!='dev'){
//     require('./checkfile.js');
// }
var exposedProperties = ['window', 'navigator', 'document'];
global.document = jsdom('');
global.window = document.defaultView;
// global.$ = require("jquery")(document.defaultView);
global.$ = {
    ajaxSetup: function () {
    },
    ajax: function () {
    }
};
global.jQuery = {
    fn: {
        extend: function () {
            return this
        }
    }
};
Object.keys(document.defaultView).forEach((property) => {
    if (typeof global[property] === 'undefined') {
        exposedProperties.push(property);
        global[property] = document.defaultView[property];
    }
});

global.navigator = {
    userAgent: 'node.js'
};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({
//     extended: false
// }));
// app.use(cookieParser());

if (app.get('env') === 'dev') {
    var webpack = require('webpack'),
        // proxy = require('http-proxy-middleware'),
        // proxyObj = require('./property/proxy.json')[process.env.TARGET || 'mock'],
        webpackDevMiddleware = require('webpack-dev-middleware'),
        webpackHotMiddleware = require('webpack-hot-middleware'),
        webpackDevConfig = require('./webpack.config.dev.js'),
        compiler = webpack(webpackDevConfig);

    app.use(webpackDevMiddleware(compiler, {
        publicPath: webpackDevConfig.output.publicPath,
        hot: true,
        noInfo: true,
        serverSideRender: true,
        stats: {
            colors: true
        }
    }));

    app.use(webpackHotMiddleware(compiler));

    // Object.keys(proxyObj).map(context => {
    //     var config = proxyObj[context];
    //     if (typeof config === 'string') {
    //         config = {
    //             target: config
    //         }
    //     }
    //     app.use(context, proxy(config));
    // });

    app.get('/lib/:file', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'lib', req.params.file))
    })

} else {
    app.use(express.static(path.join(__dirname, 'public'))); //production use static
}

app.use('/upload/file', multer({dest: 'files/'}).single('file'), fileRoute);
// app.use('/upload/file', multer({dest: 'files/'}).single('file'), fileRoute);

app.use('/', (req, res, next) => {
    if (/^\/$/.test(req.originalUrl)) {
        res.redirect('/index')
    }
    next()
}, routes);

let obj = {
    heartbeat: {},
    list: {}
}, ifUp = {}, setTimes = {};
app.use(bodyParser.json());
app.post('/pushInfo', (req, res, next)=> {
    const name=req.body.proc[0].name;
    obj.list[name] = req.body;
    obj.heartbeat[name] = 1;
    heartCheck.reset().start(name);
    res.status(200).send('hello');
});

var heartCheck = {
    timeout: 5000,
    timeoutObj: null,
    reset: function(){
        clearTimeout(this.timeoutObj);
        return this;
    },
    start: function(name){
        this.timeoutObj = setTimeout(function(){
            obj.heartbeat[name] = 0;
        //    报警
        }, this.timeout)
    }
};

app.post('/errLog', (req, res, next)=> {
    //报警
    console.log(req.body, req.body.error);
    obj.errLog = req.body;
    res.status(200).send('world');
});
app.post('/getInfo', (req, res, next)=> {
    var os = require('os');
    var cpus = os.cpus(),
        totalmem = os.totalmem(),
        freemem = os.freemem(),
        loadavg = os.loadavg();
    console.log(loadavg);
    // if(freemem<=totalmem*10%){
    //    报警
    // }
    obj.cpus = cpus;
    obj.totalmem = totalmem;
    obj.freemem = freemem;
    obj.loadavg = loadavg;
    res.status(200).json(obj);
});

module.exports = app;