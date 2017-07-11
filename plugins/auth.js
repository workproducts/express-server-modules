var es = require('express-server');

var _ = require('underscore');
var bcrypt = require('bcrypt');
var shortid = require('shortid');

var mongoose = es.db.mongoose;
var responseHelper = es.lib.responseHelper;
var bus = es.lib.bus;

var Schema = {
    username: {
        type: String,
        lowercase: true,
        trim: true
    },
    password: {
        type: String
    }
};

module.exports = function($, options) {
    options = options || {};

    var schema = {
        auth: options.required ? Schema : new mongoose.Schema(Schema)
    };

    $.add(schema);

    var encrypt = function(password) {
        return password && bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    };

    $.pre('validate', function(next) {
        var auth = this.auth;

        if (auth) {
            if (!auth.username) {
                return next(responseHelper.error(400, 'Username is required.'));
            }
            if (!auth.password) {
                return next(responseHelper.error(400, 'Password is required.'));
            }
            if (this.isModified('auth.password')) {
                auth.password = encrypt(auth.password);
            }
            if (this.isModified('auth.username')) {
                return this.constructor.findByUsername(auth.username, function(err, model) {
                    if (err && !err.isResponseError) {
                        return next(err);
                    }

                    if (model) {
                        return next(new responseHelper.error(409, 'Username is already taken.'));
                    }
                    return next();
                });
            }
        }

        return next();
    });

    $.statics.findByUsername = function(username, callback) {
        this.findOne({
            'auth.username': username && username.trim().toLowerCase()
        }, responseHelper.handleModelFindOne(this.modelName, callback));
    };

    $.methods.resetPassword = function(callback) {
        var auth = this.auth;

        var newPassword = auth.password = shortid.generate();

        this.save(responseHelper.handleModelSave(function(err, model) {
            if (err) {
                return callback(err);
            }

            var copy = _.clone(model);
            copy.auth = _.clone(model.auth);
            copy.auth.password = newPassword;
            bus.emit('reset-password', copy);
            return callback(null);
        }));
    };

    $.methods.verifyPassword = function(password, callback) {
        var auth = this.auth;

        var verifyPasswordFailed = function() {
            return callback(new responseHelper.error(400, 'Verify Password Failed.'));
        };

        this.constructor.findByUsername(auth.username, function(err, model) {
            if (err && !err.isResponseError) {
                return callback(err);
            }
            if (!model) {
                return verifyPasswordFailed();
            }
            return bcrypt.compare(password, model.auth.password, function(err, success) {
                if (err || !success) {
                    return verifyPasswordFailed();
                }
                return callback();
            });
        });
    };

    return $;
};