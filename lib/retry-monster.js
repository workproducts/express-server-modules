var es = require('express-server');

var async = require('async');
var email = es.lib.email;

module.exports = function(prefixMsg, task, callback) {

    async.retry({ times: 3, interval: 1000 }, function(next) {
            task(function(err, result) {
                if(err) {
                    console.error(prefixMsg + " - Attempting Retry. - " + err.message);
                }
                return next(err, result);
            });
        },
        function(err, result) {
            if(err) {
                console.error(prefixMsg + " - Max retries failed for call. - " + err.message);
                email.sendError({ message: prefixMsg + " - Max retries failed for call - " + err.message });
            }
            return callback(err, result);
        });

};