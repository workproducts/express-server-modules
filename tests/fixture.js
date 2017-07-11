var moment = require('moment');
var _ = require('underscore');

var $ = module.exports = {};

$.randomString = function(length) {
    length = length || 10;
    var possible = ' ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return _.sample(possible, length).join('');
};

$.randomNumber = function(length) {
    length = length || 10;
    var possible = '123456789';
    return parseInt(_.sample(possible, length).join(''));
};

$.randomEmail = function() {
    return $.randomString() + '@' + $.randomString() + '.com';
};

$.loginData = function() {
    return {
        username: 'btknorr',
        password: 'testss'
    }
};

$.authData = function() {
    return {
        username: 'btknorr',
        password: 'testss'
    }
};

$.authData2 = function() {
    return {
        username: 'adfdanzer',
        password: 'sstest'
    }
};

$.profileData = function() {
    return {
        firstName: 'Brian',
        lastName: 'Knorr',
        email: 'btknorr@gmail.com'
    }
};

$.profileData2 = function() {
    return {
        firstName: 'Amber',
        lastName: 'Fussell',
        email: 'adfdanzer@gmail.com'
    }
};

$.giftData = function() {
    return {
        gifts:[{
            start: new moment(),
            months: 2,
            from: 'me'
        }]
    }
};

$.sessionData = function() {
    return {
        pushToken: $.randomString(),
        username: $.randomNumber()
    };
};