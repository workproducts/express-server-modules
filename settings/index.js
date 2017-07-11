var es = require('express-server');
var logger = es.logs.server;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');
var favicon = require('serve-favicon');
var errorhandler = require('errorhandler');

var server = es.server;
var express = es.express;

server.set('case sensitive routing', true);
server.set('port', process.env.PORT || process.env.VCAP_APP_PORT || 3000);
server.set('views', ['./views']);
server.set('view engine', 'ejs');
server.use(express.static('./public'));
server.use(favicon('./public/favicon.ico'));
server.use(logger);
server.use(methodOverride());
server.use(cookieParser());

if (process.env.NODE_ENV !== 'production') {
    server.use(errorhandler());
}