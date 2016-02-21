import Plugin = require('../amma-plugin-loader');
let pkg = require('./package.json');
let PluginLoader = Plugin.default;
let config = {
        services: {
            'eventEmitter': {
                cls: require('./services/event.emitter').default,
                methods: [
                    {
                        name: 'eventEmitter',
                        methodName: 'get'
                    }
                ]
            }
        },
        attributes: {
            pkg: pkg
        }
    }
    ;
let plugin = new PluginLoader(config);
export = plugin;
