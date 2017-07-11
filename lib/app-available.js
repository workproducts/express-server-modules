module.exports = function(req, res, next) {
    var es = require('express-server');
    var responseHelper = es.lib.responseHelper;

    if(es.config.server.disableApp) {
        return responseHelper.sendError(responseHelper.error(503, "App is currently unavailable."), res);
    }
    return next();
};