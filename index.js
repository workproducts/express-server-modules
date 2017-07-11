process.env.NODE_ENV = process.env.NODE_ENV || 'local';

require('log-timestamp');
module.exports = require('express-server');