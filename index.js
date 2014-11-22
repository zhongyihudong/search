var express = require('express');
var favicon = require('static-favicon');
var app = express();
var routen = require('express-enrouten');

/**
 * 注册中间件
 */
app.use(favicon());
app.use(express.static(__dirname + '/public'));
app.disable('x-powered-by');

app.use(routen({
    directory: 'api'
}));

var port = process.env.PORT || 3000;

app.listen(port, function () {
    console.log("server is started, PORT:" + port);
});