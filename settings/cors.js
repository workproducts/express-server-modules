var es = require('express-server');
var cors = require('cors');

module.exports = function() {
    es.server.use(cors());
};