var _ = require('lodash');
var userRoute = require('./user.route');
var profileRoute = require('./profile.route');
var profileTempRoute = require('./profile-temp.route');
module.exports = _.union(userRoute, profileRoute, profileTempRoute);
