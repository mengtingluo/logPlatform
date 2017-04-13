var path = require('path');
var express = require('express');
var router = express.Router();
var React = require('react');
var ReactDOMServer = require('react-dom/server');
var parseEntry = require('../middleware/ParsePlugin').parseEntry;
var enter = parseEntry(path.join(__dirname, "../source"), {
    ignore: ['lib']
});
var source = {};
var getFilePath = function () {
};
var dev = process.env.NODE_ENV === 'dev';

if (dev) {
    getFilePath = require('../middleware/getFilePathPlugin');
} else {
    source = require('../server/static.prod.json');
}

router.get('/:file', (req, res, next) => {
    const fileName = req.params.file,
        Model = require(enter[fileName]),
        status = res.locals.webpackStats || {},
        commonPaths = dev ? getFilePath(status, 'common') : source.common,
        currentPaths = dev ? getFilePath(status, fileName) : source[fileName],
        scripts = Array.from(commonPaths.js).concat(Array.from(currentPaths.js)),
        csses = Array.from(currentPaths.css);
    res.render('template', {
        csses: csses,
        scripts: scripts,
        content: ReactDOMServer.renderToString(<Model url={req.url}/>),
    });
});

// router.get('/*', (req, res, next) => {
//     if (/\./.test(req.originalUrl)) {
//         next()
//     } else {
//         res.redirect('/index')
//     }
// });

module.exports = router;

// '/' next() -> error handlers
// 404 next() -> error handlers