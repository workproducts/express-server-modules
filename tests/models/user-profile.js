var es = require('express-server');
var mongoose = es.db.mongoose;
var plugins = es.plugins;

var UserSchema = new mongoose.Schema({}, {
    timestamps: true
});

UserSchema.plugin(plugins.profile);

module.exports = mongoose.model('UserProfile', UserSchema);