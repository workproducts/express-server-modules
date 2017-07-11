var es = require('express-server');

var mongoose = es.db.mongoose;
var responseHelper = es.lib.responseHelper;

var Schema = {
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        lowercase: true,
        trim: true
    }
};

module.exports = function($, options) {
    options = options || {};

    var schema = {
        profile: options.required ? Schema : new mongoose.Schema(Schema)
    };

    $.add(schema);

    $.pre('validate', function(next) {
        var profile = this.profile;

        if (profile) {
            if (!profile.firstName) {
                return next(responseHelper.error(400, 'First Name is required.'));
            }
            if (!profile.lastName) {
                return next(responseHelper.error(400, 'Last Name is required.'));
            }
            if (!profile.email) {
                return next(responseHelper.error(400, 'Email is required.'));
            }
        }

        next();
    });

    $.statics.findByEmail = function(email, callback) {
        this.findOne({
            'profile.email': email && email.trim().toLowerCase()
        }, responseHelper.handleModelFindOne(this.modelName, callback));
    };

    return $;
};