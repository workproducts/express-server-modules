var es = require('express-server');

var should = require('should');
var _ = require('underscore');

var User = es.models.userAuth;
var bus = es.lib.bus;

var fixture = require('./fixture');

describe("Auth", function() {

    beforeEach(function(done) {
        User.remove({}, done);
    });

    afterEach(function(done) {
        done();
    });

    it('should save new user without auth', function(done) {
        new User().save(function(err, user) {
            if (err) {
                return done(err);
            }
            should(user._id).be.ok();
            should(user.auth).not.be.ok();
            done();
        });
    });

    it('should save new user auth', function(done) {
        var data = fixture.authData();
        new User({
            auth: data
        }).save(function(err, user) {
                if (err) {
                    return done(err);
                }

                var auth = user.auth;
                should(user._id).be.ok();
                should(auth.username).equal(data.username);
                should(auth.password).be.ok();
                done();
            });
    });

    it('should not save with existing username', function(done) {
        var data = fixture.authData();
        new User({
            auth: data
        }).save(function(err) {
                if (err) {
                    return done(err);
                }
                new User({
                    auth: data
                }).save(function(err) {
                        should(err.status).equal(409);
                        should(err.message).equal('Username is already taken.');
                        done();
                    });
            });
    });

    it('should not save auth with no username', function(done) {
        var data = fixture.authData();
        delete data.username;

        new User({
            auth: data
        }).save(function(err) {
                should(err.status).equal(400);
                should(err.message).equal('Username is required.');
                done();
            });
    });

    it('should not save auth with no password', function(done) {
        var data = fixture.authData();
        delete data.password;

        new User({
            auth: data
        }).save(function(err) {
                should(err.status).equal(400);
                should(err.message).equal('Password is required.');
                done();
            });
    });

    it('should update auth', function(done) {
        var data = fixture.authData();
        new User({
            auth: data
        }).save(function(err, user) {
                if (err) {
                    return done(err);
                }

                var data2 = fixture.authData2();
                _.extend(user.auth, data2);

                user.save(function(err, user) {
                    if (err) {
                        return done(err);
                    }

                    var auth = user.auth;
                    should(auth.username).equal(data2.username);
                    done();
                });
            });
    });

    it('should update auth without setting password', function(done) {
        var data = fixture.authData();
        new User({
            auth: data
        }).save(function(err, user) {
                if (err) {
                    return done(err);
                }

                var data2 = fixture.authData2();
                delete data2.password;
                _.extend(user.auth, data2);

                user.save(function(err, user) {
                    if (err) {
                        return done(err);
                    }

                    var auth = user.auth;
                    should(auth.username).equal(data2.username);
                    done();
                });
            });
    });


    it('should login user', function(done) {
        var data = fixture.authData();
        new User({
            auth: data
        }).save(function(err, user) {
                if (err) {
                    return done(err);
                }
                var data = fixture.loginData();

                User.findByUsername(data.username, function(err, user2) {
                    if (err) {
                        return done(err);
                    }
                    user2.verifyPassword(data.password, function(err) {
                        if (err) {
                            return done(err);
                        }

                        var auth2 = user2.auth;
                        should(user2._id.toString()).equal(user._id.toString());
                        should(auth2.password).be.ok();
                        done();
                    });
                });
            });
    });

    it('should login user after updating', function(done) {
        var data = fixture.authData();
        new User({
            auth: data
        }).save(function(err, user) {
                if (err) {
                    return done(err);
                }
                var data2 = fixture.authData2();
                _.extend(user.auth, data2);

                user.save(function(err, user2) {
                    if (err) {
                        return done(err);
                    }
                    user2.verifyPassword(data2.password, function(err) {
                        if (err) {
                            return done(err);
                        }

                        var auth2 = user2.auth;
                        should(user2._id.toString()).equal(user._id.toString());
                        should(auth2.password).be.ok();
                        done();
                    });
                });
            });
    });

    it('should not login user with bad username', function(done) {
        var data = fixture.authData();
        new User({
            auth: data
        }).save(function(err) {
                if (err) {
                    return done(err);
                }

                User.findByUsername('wow', function(err) {
                    should(err.status).equal(404);
                    should(err.message).equal('UserAuth not found.');
                    done();
                });
            });
    });

    it('should not login user with bad password', function(done) {
        var data = fixture.authData();
        new User({
            auth: data
        }).save(function(err) {
                if (err) {
                    return done(err);
                }

                User.findByUsername(data.username, function(err, user2) {
                    if (err) {
                        return done(err);
                    }
                    user2.verifyPassword('wowow', function(err) {
                        should(err.status).equal(400);
                        should(err.message).equal('Verify Password Failed.');
                        done();
                    });
                });
            });
    });

    it('should reset password', function(done) {

        bus.on('reset-password', function(user) {
            var auth = user.auth;
            should(auth.password).be.ok();
            done();
        });

        var data = fixture.authData();
        new User({
            auth: data
        }).save(function(err, user) {
                if (err) {
                    return done(err);
                }

                var auth = user.auth;
                should(auth.password).be.ok();

                user.resetPassword(function(err) {
                    if (err) {
                        return done(err);
                    }
                });
            });
    });
});