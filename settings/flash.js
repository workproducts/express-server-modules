var es = require('express-server');

module.exports = function() {
    var flash = require('connect-flash');
    es.server.use(flash());

    es.server.use(function(req, res, next) {
        res.locals.flashSuccess = req.flash('success');
        res.locals.flashError = req.flash('error');
        next();
    });
};