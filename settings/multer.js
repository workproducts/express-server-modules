var es = require('express-server');
var multer = require('multer');

module.exports = function() {
    es.server.use(multer().single('upload'));
};