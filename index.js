var express = require('express');
var favicon = require('static-favicon');
var app = express();
var routen = require('express-enrouten');
var bodyParser= require('body-parser');

/**
 * 注册中间件
 */
app.use(favicon());
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.disable('x-powered-by');

app.use(routen({
    directory: 'api'
}));

var port = process.env.PORT || 3000;

app.listen(port, function () {
    console.log("server is started, PORT:" + port);
});