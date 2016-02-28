import _ = require('lodash');
const userRoutes = require('./user.route').default;
const profileRoutes = require('./profile.route').default;
module.exports = _.union(userRoutes, profileRoutes);