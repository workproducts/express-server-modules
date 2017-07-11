var es = require('express-server');

var mongoose = es.db.mongoose;

var moment = require('moment');
var _ = require('underscore');

var SessionSchema = new mongoose.Schema({
    _id:  { type: String },
    session: String,
    expires: Date
}, { timestamps: true });

SessionSchema.statics.availableForPush = function(callback) {
    Model.find({ expires: { $gt: moment() } }).lean().exec(function(err, sessions) {
        _.each(sessions, function(x) {
            x.parsedSession = JSON.parse(x.session);
        });

        var validSessions = _.filter(sessions, function(x) {
            return x.parsedSession.username && x.parsedSession.pushToken;
        });

        return callback(null, validSessions);
    });
};

var Model = module.exports = mongoose.model('Session', SessionSchema);