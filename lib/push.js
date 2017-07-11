var $ = module.exports = {};

var es = require('express-server');

var ArrowDB = require('arrowdb');
var arrowDBApp = new ArrowDB(es.config.server.appcelerator.pushKey);

var _ = require('underscore');

$.subscribe = function(token, type, channel, callback) {
    arrowDBApp.pushNotificationsSubscribeToken({
        device_token: token,
        channel: channel,
        type: type
    }, callback);
};

$.unsubscribe = function(token, channel, callback) {
    arrowDBApp.pushNotificationsUnsubscribeToken({
        channel: channel,
        device_token: token
    }, callback);
};

$.notify = function(channel, tokens, payloadOrMessage, callback) {
    if(tokens.length == 0) {
        return callback();
    }

    //backwards compatibility for message
    if (!_.isObject(payloadOrMessage)) {
        payloadOrMessage = {
            alert: payloadOrMessage
        }
    }

    var payload = _.extend({ "sound": "none", "vibrate": true, "icon": "notification" }, payloadOrMessage);
    console.log(':::: Sending push notification payload', payload);
    arrowDBApp.pushNotificationsNotifyTokens({
        channel: channel,
        to_tokens: tokens.join(","),
        payload: payload
    }, callback);
};

$.notifyUsers = function(usernames, payloadOrMessage, callback) {
    //backwards compatibility for message
    if (!_.isObject(payloadOrMessage)) {
        payloadOrMessage = {
            alert: payloadOrMessage
        }
    }

    console.log(":::: Sending push notification to " + usernames.length + ": " + payloadOrMessage);
    es.models.session.availableForPush(function(err, sessions) {
        var sessionsToNotify = _.filter(sessions, function(x) {
            return _.contains(usernames, x.parsedSession.username);
        });

        var tokensToNotify = _.map(sessionsToNotify, function(x) {
            return x.parsedSession.pushToken;
        });
        return $.notify('general', tokensToNotify, payloadOrMessage, callback);
    });
};

$.notifyAllUsers = function(payloadOrMessage, callback) {
    //backwards compatibility for message
    if (!_.isObject(payloadOrMessage)) {
        payloadOrMessage = {
            alert: payloadOrMessage
        }
    }

    es.models.session.availableForPush(function(err, sessions) {
        console.log(":::: Sending push notification to ALL Users: " + sessions.length + ": " + payloadOrMessage);

        var tokensToNotify = _.map(sessions, function(x) {
            return x.parsedSession.pushToken;
        });

        return $.notify('general', tokensToNotify, payloadOrMessage, callback);
    });
};