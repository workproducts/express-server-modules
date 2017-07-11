var es = require('express-server');
var bodyParser = require('body-parser');

module.exports = function() {
    var server = es.server;
    server.use(bodyParser.json({
        limit: '10mb'
    }));
    server.use(bodyParser.text({
        limit: '10mb',
        type:'text/xml'
    }));
    server.use(bodyParser.urlencoded({
        limit: '10mb',
        extended: true
    }));
};