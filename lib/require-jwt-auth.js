var es = require('express-server');
var s = require("underscore.string");

module.exports = function(Model) {
    var namespace = s.decapitalize(Model.modelName);

    var responseHelper = es.lib.responseHelper;
    var jwt = es.lib.jwt;

    return function(req, res, next) {
        var encodedToken = req.body.token || req.query.token || req.headers['x-access-token'];

        if (!encodedToken) {
            return responseHelper.sendError(new responseHelper.error(403, 'Forbidden'), res);
        }

        jwt.decode(encodedToken, function(err, token) {
            if (err) {
                console.error('!!!Decode Token', err);
                return responseHelper.sendError(new responseHelper.error(401, 'Unauthorized'), res);
            }
            //console.log('!!! Model.findById token = ', token);
            Model.findById(token.id, function(err, model) {
                if (err) {
                    return responseHelper.sendError(err, res);
                }
                if (!model) {
                    return responseHelper.sendError(new responseHelper.error(401, 'Unauthorized'), res);
                }
                req[namespace] = model;
                return next();
            });
        });
    };
};