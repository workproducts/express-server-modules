var $ = module.exports = {};

var config = require('express-server').config.server;
var awsConfig = config.aws;
var AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: awsConfig.accessKeyId,
    secretAccessKey: awsConfig.secretAccessKey,
    region: awsConfig.region
});

var ses = new AWS.SES();
var mailcomposer = require('mailcomposer');
var moment = require('moment');

$.send = function(params, callback) {
    if(process.env.NODE_ENV !== 'production') {
        params.addresses = config.email.errorsTo;
    }

    var sendAddresses = params.addresses.slice(0, 48);
    var restAddresses = params.addresses.slice(48, params.addresses.length - 1);
    console.log('!!!!Send Email to addresses ', sendAddresses);
    console.log('!!!!Send Email from ' + params.from);

    var data = {
        from: params.from,
        to: config.email.noReplyTo,
        cc: '',
        bcc: sendAddresses,
        subject: params.subject,
        text: params.message,
        html: params.html,
        replyTo: params.replyTo,
        attachments: params.attachments || [],
        envelope: {
            from: params.from,
            to: config.email.noReplyTo,
            cc: '',
            bcc: sendAddresses
        }
    };

    var mail = mailcomposer(data);

    mail.build(function(err, message) {
        if(process.env.NODE_ENV !== 'test') {
            ses.sendRawEmail({ RawMessage: { Data: message.toString() } }, function(err, data) {
                console.log("\nsending an email - expecting success");
                console.log('email err=' + JSON.stringify(err));
                console.log('email returned=' + JSON.stringify(data));
                if(restAddresses.length > 0) {
                    params.addresses = restAddresses;
                    $.send(params, callback);
                } else {
                    return callback && callback(err);
                }
            });
        } else {
            console.log("TEST email would have sent, if we weren't in test")
        }
    });
};

$.sendError = function(err) {
    err = err.detail || err;

    var txt = "Error.\n\n";
    txt += moment().toISOString() + "\r\n";

    if(err.message) {
        txt += err.message + "\n\n";
    }

    if(err.stack) {
        txt += err.stack + "\n\n";
    }

    if(err.data) {
        txt += JSON.stringify(err.data);
    }

    $.send(
        {
            addresses: [ config.email.errorsTo ],
            subject: config.brand.name + ' Server Error - ' + process.env.NODE_ENV,
            message: txt,
            html: txt,
            from: config.email.from
        },
        function(err) {
            if(err) {
                console.log('**Error sending error email**');
            }
        });
};

$.sendWarning = function(err) {
    err = err.detail || err;

    var txt = "Warning.\n\n";
    txt += moment().toISOString() + "\r\n";

    if(err.message) {
        txt += err.message + "\n\n";
    }

    if(err.stack) {
        txt += err.stack + "\n\n";
    }

    if(err.data) {
        txt += JSON.stringify(err.data);
    }

    $.send(
        {
            addresses: [ config.email.errorsTo ],
            subject: config.brand.name + ' Server Warning - ' + process.env.NODE_ENV,
            message: txt,
            html: txt,
            from: config.email.from
        },
        function(err) {
            if(err) {
                console.log('**Error sending warning email**');
            }
        });
};