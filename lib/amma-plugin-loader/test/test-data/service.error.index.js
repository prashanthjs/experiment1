var Plugin = require('../../index');
var attributes = require('./package.json');
var PluginLoader = Plugin.default;
var TestController = (function () {
    function TestController() {
        this.setServer = function (server) {
        };
        this.init = function (next) {
            next();
        };
    }
    return TestController;
})();
var config = {
    services: {
        'testController': {
            cls: TestController,
            methods: [{
                    type: 'method',
                    methodName: 'test',
                    name: 'testController'
                },
                {
                    type: 'method',
                    methodName: 'testMethod',
                    name: 'testMethod'
                }
            ]
        }
    },
    routes: [{
            method: 'GET',
            path: '/test',
            config: {
                handler: 'testController'
            }
        }],
    attributes: {
        pkg: attributes
    }
};
var plugin = new PluginLoader(config);
module.exports = plugin;
