var es = require('express-server');

var should = require('should');
var _ = require('underscore');

var User = es.models.userProfile;

var fixture = require('./fixture');

describe("Profile", function() {

    beforeEach(function(done) {
        User.remove({}, done);
    });

    afterEach(function(done) {
        done();
    });

    it('should create new user without profile', function(done) {
        new User().save(function(err, user) {
                if (err) {
                    return done(err);
                }
                should(user._id).be.ok();
                should(user.profile).not.be.ok();
                done();
            });
    });

    it('should create new user profile', function(done) {
        var data = fixture.profileData();
        new User({
            profile: data
        }).save(function(err, user) {
            if (err) {
                return done(err);
            }
            var profile = user.profile;
            should(profile.firstName).equal(data.firstName);
            should(profile.lastName).equal(data.lastName);
            should(profile.email).equal(data.email);
            done();
        });
    });

    it('should update user profile', function(done) {
        var data = fixture.profileData();
        new User({
            profile: data
        }).save(function(err, user) {
            if (err) {
                return done(err);
            }

            var data2 = fixture.profileData2();
            _.extend(user.profile, data2);

            user.save(function(err, user) {
                if (err) {
                    return done(err);
                }
                var profile = user.profile;
                should(profile.firstName).equal(data2.firstName);
                should(profile.lastName).equal(data2.lastName);
                should(profile.email).equal(data2.email);
                done();
            });
        });
    });

    it('should not create user profile without required fields', function(done) {
        var data = fixture.profileData();
        delete data.firstName;

        new User({
            profile: data
        }).save(function(err) {
            should(err.status).equal(400);
            should(err.message).equal('First Name is required.');

            data = fixture.profileData();
            delete data.lastName;

            new User({
                profile: data
            }).save(function(err) {
                should(err.status).equal(400);
                should(err.message).equal('Last Name is required.');

                data = fixture.profileData();
                delete data.email;

                new User({
                    profile: data
                }).save(function(err) {
                    should(err.status).equal(400);
                    should(err.message).equal('Email is required.');

                    done();
                });
            });

        });
    });
});