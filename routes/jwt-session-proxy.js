var es = require('express-server');
var config = es.config;
var responseHelper = es.lib.responseHelper;

var httpProxy = require('http-proxy');
var proxyServer = httpProxy.createProxyServer({
    proxyTimeout: 10*60*1000
});

module.exports = function() {

    var $ = es.routers.server;

    proxyServer.on('proxyRes', function(proxyRes, req) {
        proxyRes.on('data', function(data) {
            var json = null;
            try {
                json = JSON.parse(data.toString());
            } catch(e) {}
            //console.log('!!!proxyRes json = ', json);
            if (json && json.token) {
                req.session.token = json.token;
            }
        });
    });

    proxyServer.on('proxyReq', function(proxyReq, req) {
        //console.log('!!!proxyReq token = ', req.session.token);
        if (req.session.token) {
            proxyReq.setHeader('x-access-token', req.session.token);
        }
    });

    var proxy = function(req, res) {
        console.log('PROXY', req.url, config.server['rd-enterprise-url']);
        proxyServer.web(req, res, {
            target: config.server['rd-enterprise-url'],
            changeOrigin: true
        });
    };

    $.all('/logout', function(req, res) {
        req.session.destroy();
        responseHelper.send(null, res);
    });

    $.all('/session', function(req, res) {
        if (req.session.token) {
            return responseHelper.send(null, {
                token: req.session.token
            }, res);
        }
        return responseHelper.send(responseHelper.error(401, 'Unauthorized.'), null, res);
    });

    $.all('*', proxy);

    return $;

};