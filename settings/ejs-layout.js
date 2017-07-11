var es = require('express-server');

module.exports = function() {
    es.server.use(require('express-ejs-layouts'));
};