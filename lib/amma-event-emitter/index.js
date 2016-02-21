var Plugin = require('../amma-plugin-loader');
var pkg = require('./package.json');
var PluginLoader = Plugin.default;
var config = {
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
};
var plugin = new PluginLoader(config);
module.exports = plugin;
