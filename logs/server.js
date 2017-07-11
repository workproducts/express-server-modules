var es = require('express-server');
var config = es.config.server;

var winston = require('winston');
var util = require('util');
var morgan = require('morgan');

var formatArgs = function(args){
    return [util.format.apply(util.format, Array.prototype.slice.call(args))];
};

winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {
    'timestamp':true,
    'colorize':true
});

console.log = function(){
    winston.info.apply(winston, formatArgs(arguments));
};
console.info = function(){
    winston.info.apply(winston, formatArgs(arguments));
};
console.warn = function(){
    winston.warn.apply(winston, formatArgs(arguments));
};
console.error = function(){
    winston.error.apply(winston, formatArgs(arguments));
};
console.debug = function(){
    winston.debug.apply(winston, formatArgs(arguments));
};

if(config.logEntries) {
    require('le_node');
    winston.add(winston.transports.Logentries, {
        token: config.logEntries.token
    });
}

module.exports = morgan(':remote-addr - :remote-user ":method :url HTTP/:http-version" :status :res[content-length] - :response-time ms', {
    stream: {
        write:function(message, encoding) {
            winston.info(message.slice(0, -1));
        }
    }
});