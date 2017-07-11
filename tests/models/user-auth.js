var es = require('express-server');
var mongoose = es.db.mongoose;
var plugins = es.plugins;

var UserSchema = new mongoose.Schema({}, {
    timestamps: true
});

UserSchema.plugin(plugins.auth);

module.exports = mongoose.model('UserAuth', UserSchema);