var s = require("underscore.string");

module.exports = function(Model) {
    var namespace = s.decapitalize(Model.modelName);

    var responseHelper = require('express-server').lib.responseHelper;

    return function(req, res, next) {
        if (!req.session.username) {
            return responseHelper.sendError(new responseHelper.error(401, 'Unauthorized'), res);
        }
        Model.findByUsername(req.session.username, function(err, model) {
            if (err) {
                return responseHelper.sendError(err, res);
            }
            if (!model) {
                return responseHelper.sendError(new responseHelper.error(401, 'Unauthorized'), res);
            }
            req[namespace] = model;
            return next();
        });
    };
};