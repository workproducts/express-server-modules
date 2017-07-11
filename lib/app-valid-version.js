module.exports = function(req, res, next) {
    var es = require('express-server');
    var config = es.config.server;

    var versionHeader = req.headers[ 'x-version' ] || req.headers['x-app-version'];
    var osNameHeader = req.headers[ 'x-osname' ] || req.headers['x-os-name'];
    var osVersionHeader = req.headers[ 'x-osversion' ] || req.headers['x-os-version'];

    if(versionHeader) {
        var version = parseInt(versionHeader.replace(/\./g, ''));
        if(version < config.minSupportedVersion) {
            return res.json({
                error: "An upgrade is required to continue using this app. Please visit your AppStore and update.  If you are unable to update, please delete and reinstall the app.  Thanks!"
            }, 400);
        }
    }

    return next();
};