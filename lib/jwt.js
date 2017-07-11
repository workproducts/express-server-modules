var es = require('express-server');
var jwt = require('jsonwebtoken');
var config = es.config.server;

var $ = module.exports = {};

$.encode = function(data, callback) {
    return jwt.sign(data, config.jwt.secret, {
        expiresInMinutes: config.jwt.expires || 4320 // 3 days
    }, function(result) {
        return callback(null, result);
    });
};

$.decode = function(token, callback) {
    jwt.verify(token, config.jwt.secret, callback);
};

