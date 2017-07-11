var es = require('express-server');
var should = require('should');
var _ = require('underscore');

var Session = es.models.session;
var fixture = require('./fixture');
var moment = require('moment');

describe("Session", function() {

    beforeEach(function(done) {
        Session.remove({}, done);
    });

    afterEach(function(done) {
        done();
    });

    describe("Model", function() {

        it('should provide list of sessions that have push tokens', function(done) {
            var sData = fixture.sessionData();

            var sessionData = {
                expires: moment().add(14, 'days'),
                session: JSON.stringify(sData)
            };

            new Session(sessionData).save(function(err) {
                if(err) {
                    return done(err);
                }

                Session.availableForPush(function(err, sessions) {
                    if(err) {
                        return done(err);
                    }

                    should(sessions.length).equal(1);
                    should(sessions[ 0 ].parsedSession.pushToken).equal(sData.pushToken);
                    should(sessions[ 0 ].parsedSession.username).equal(sData.username);
                    done();
                });
            });
        });

        it('available sessions for push can not be expired', function(done) {
            var sessionData = {
                expires: moment().subtract(1, 'minute'),
                session: JSON.stringify(fixture.sessionData())
            };

            new Session(sessionData).save(function(err) {
                if(err) {
                    return done(err);
                }

                Session.availableForPush(function(err, sessions) {
                    if(err) {
                        return done(err);
                    }

                    should(sessions.length).equal(0);
                    done();
                });
            });
        });

        it('available sessions for push must have a push token', function(done) {
            var sData = fixture.sessionData();
            delete sData.pushToken;

            var sessionData = {
                expires: moment().add(14, 'days'),
                session: JSON.stringify(sData)
            };

            new Session(sessionData).save(function(err) {
                if(err) {
                    return done(err);
                }

                Session.availableForPush(function(err, sessions) {
                    if(err) {
                        return done(err);
                    }

                    should(sessions.length).equal(0);
                    done();
                });
            });
        });

    });
});