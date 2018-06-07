var es = require('express-server');

module.exports = function() {
    var config = es.config;

    var mongoose = es.db.mongoose = require('mongoose');
    mongoose.Promise = require('bluebird');
    
    mongoose.connect(config.server.dbUri, {
        server: {
            socketOptions: {keepAlive: 300000, connectTimeoutMS: 30000}
        },
        replset: {
            socketOptions: {keepAlive: 300000, connectTimeoutMS: 30000}
        }
    });

    return mongoose;
};
