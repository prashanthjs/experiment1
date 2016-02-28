import PluginLoader = require('../amma-plugin-loader/lib/services/plugin.loader');
const pkg = require('./package.json');
const Plugin = require('../amma-plugin-loader');
import ServiceConfig = require('./lib/config/services.config');

const config:PluginLoader.IConfig = {
    services: ServiceConfig.default,
    attributes: {
        pkg: pkg
    }
};
const plugin = Plugin.default(config);
export = plugin;