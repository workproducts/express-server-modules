var es = require('express-server');
var should = require('should');

var jwt = es.lib.jwt;

describe("JWT", function() {

    it('should encode and decode', function(done) {
        var payload = {
            id: '123abc'
        };
        jwt.encode(payload, function(err, encoded) {
            if (err) {
                return done(err);
            }
            jwt.decode(encoded, function(err, decoded) {
                if (err) {
                    return done(err);
                }
                should(decoded.id).equal(payload.id);
                done();
            });
        });
    });
});