var es = require('express-server');
var _ = require('underscore');

module.exports = function(sessionOpts) {
    var session = require('express-session');
    var MongoStore = require('connect-mongo/es5')(session);
    var config = es.config;

    var opts = _.extend({
        secret: 'ss-express-server',
        resave: true,
        saveUninitialized: true,
        store: new MongoStore({
            url: config.server.dbUri
        })
    }, sessionOpts);

    es.server.use(session(opts));
};