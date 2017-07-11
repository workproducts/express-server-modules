var es = require('express-server');
var _ = require('underscore');
var moment = require('moment');

var $ = module.exports = {};

$.error = function(status, message) {
    if (typeof status === 'undefined') {
        status = 400;
    }

    var err = new Error(message);
    err.name = 'ResponseError';
    err.status = status;
    err.isResponseError = true;

    return err;
};

$.handleModelSave = function(callback) {
    return function(err, result) {
        if (err && err.name === 'ValidationError') {
            err = $.error(400, _.values(err.errors)[0].message);
        }
        return callback(err, result);
    };
};

$.handleModelFindOne = function(name, callback) {
    return function(err, result) {
        if (err) {
            return callback(err);
        }

        if (!result) {
            err = $.error(404, name + ' not found.');
        }

        return callback(err, result);
    };
};

$.sendError = function(err, res) {
    console.error('ERROR stack ', err.stack);
    if (err.isResponseError) {
        res.json({
            error:err.message
        }, err.status);
    } else {
        res.send('Internal Server Error', 500);
    }
    return true;
};

$.send = function(err, result, res) {
    if (typeof res === 'undefined') {
        res = result;
        result = {};
    }
    err && $.sendError(err, res) || res.json(result||{});
};

$.render = function(err, view, result, res) {
    if (typeof res === 'undefined') {
        res = result;
        result = {};
    }
    if (err) {
        if (err.status == 401) {
            return res.redirect('/logout');
        }
        view = 'error';
        result = {
            error: err.message || err.error || "We're sorry, but something went wrong.  We've been notified about this issue and we'll take a look at it shortly."
        };
    }
    return res.render(view, _.extend(result||{}, {_:_}, {m:moment}, {session:res.req.session}, {config:es.config.server}));
};

$.renderError = function(err, res) {
    $.render(err, null, null, res);
};

$.flash = function(err, successMessage, req) {
    if (err) {
        return req.flash('error', err.message || "We're sorry, but something went wrong.  We've been notified about this issue and we'll take a look at it shortly.")
    }
    return req.flash("success", successMessage);
};