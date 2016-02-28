import PluginLoader = require('../amma-plugin-loader/lib/services/plugin.loader');
const pkg = require('./package.json');
const Plugin = require('../amma-plugin-loader');
import UserRoute = require('./lib/configs/user.route');
import Services = require('./lib/configs/services.config');

const config:PluginLoader.IConfig = {
    routes: require('./lib/configs/routes'),
    services: Services.default,
    attributes: {
        pkg: pkg
    }
};
const plugin = Plugin.default(config);
export = plugin;