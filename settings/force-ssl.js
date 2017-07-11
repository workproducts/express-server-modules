var es = require('express-server');

module.exports = function(options) {
    if (options) {
        es.server.set('forceSSLOptions', options);
    }
    es.server.use(require('express-force-ssl'));
};