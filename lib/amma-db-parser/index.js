var pkg = require('./package.json');
var Plugin = require('../amma-plugin-loader');
var config = {
    services: [{
        cls: require('./lib/services/db.parser.factory').default,
        name: 'dbParserFactory'
    }],
    attributes: {
        pkg: pkg
    }
};
var plugin = Plugin.default(config);
module.exports = plugin;
