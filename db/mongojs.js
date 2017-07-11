var es = require('express-server');

module.exports = function() {
    var config = es.config;

    var $ = es.db.mongojs = require('mongojs')(config.server.dbUri);

    $.on('error', function(err) {
        console.error('Mongojs Error: ', err);
    });

    return $;
};