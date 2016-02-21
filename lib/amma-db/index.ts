import Plugin = require('../amma-plugin-loader');
let pkg = require('./package.json');
let PluginLoader = Plugin.default;
let config:Plugin.IConfig = {
    services: {
        'dbService': {
            cls: require('./services/db').default,
            methods: [{
                name: 'connectDb',
                methodName: 'connectDb'
            },
                {
                    name: 'disconnectDb',
                    methodName: 'disconnectDb'
                },

            ]
        }
    },
    attributes: {
        pkg: pkg
    }
};
let plugin = new PluginLoader(config);
export = plugin;
