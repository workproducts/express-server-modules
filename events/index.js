var es = require('express-server');
var email = es.lib.email;

process.on('uncaughtException', function(err) {
    console.error('!uncaughtException: ', err);
    email.sendError(err);
});