import _ = require('lodash');
const userRoute = require('./user.route');
const profileRoute = require('./profile.route');
const profileTempRoute = require('./profile-temp.route');
module.exports = _.union(userRoute, profileRoute, profileTempRoute);