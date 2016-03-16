import _ = require('lodash');
const whiteLabelRoute = require('./whitelabel.route');
const logoRoute = require('./logo.route');
module.exports = _.union(whiteLabelRoute, logoRoute);