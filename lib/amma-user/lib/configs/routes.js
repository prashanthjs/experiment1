var _ = require('lodash');
var userRoutes = require('./user.route').default;
var profileRoutes = require('./profile.route').default;
module.exports = _.union(userRoutes, profileRoutes);
