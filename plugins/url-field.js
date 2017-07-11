var es = require('express-server');

var mongoose = es.db.mongoose;
var responseHelper = es.lib.responseHelper;

var _ = require('underscore');

module.exports = function($, options) {

    options = options || {};
    var required = options.required || true;

    $.add({ url: String });

    $.pre('validate', function(next) {
        var model = this;

        var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;

        if(required && !model.url) {
            return next(responseHelper.error(400, 'Url is required.'));
        }

        if(model.url && !regexp.test(model.url)) {
            return next(responseHelper.error(400, 'Url is not valid.'));
        }

        return next();
    });

    return $;
};