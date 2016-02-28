import PluginLoader = require('../amma-plugin-loader/lib/services/plugin.loader');
const pkg = require('./package.json');
const Plugin = require('../amma-plugin-loader');

const config:PluginLoader.IConfig = {
    services: [{
        cls: require('./lib/services/db.parser.factory').default,
        name: 'dbParserFactory'
    }],
    attributes: {
        pkg: pkg
    }
};
const plugin = Plugin.default(config);
export = plugin;
