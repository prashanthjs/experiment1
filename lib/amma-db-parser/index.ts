import Plugin = require('../amma-plugin-loader');
let pkg = require('./package.json');
let PluginLoader = Plugin.default;
let config:Plugin.IConfig = {
    services: {
        'dbParser': {
            cls: require('./services/db.parser').default,
            methods: [{
                name: 'ammaDbParser',
                methodName: 'getDbParser'
            }]
        },
    },
    routes: [],
    attributes: {
        pkg: pkg
    }
};
let plugin = new PluginLoader(config);
export = plugin;
