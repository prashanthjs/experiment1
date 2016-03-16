var _ = require('lodash');
var whiteLabelRoute = require('./whitelabel.route');
var logoRoute = require('./logo.route');
module.exports = _.union(whiteLabelRoute, logoRoute);
