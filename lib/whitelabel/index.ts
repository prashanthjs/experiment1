import PluginLoader = require('../amma-plugin-loader/lib/services/plugin.loader');
import Plugin = require('../amma-plugin-loader');
const config:PluginLoader.IConfig = require('./lib/configs');
const plugin = Plugin.default(config);
export = plugin;