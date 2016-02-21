import Plugin = require('../../index');
let attributes = require('./package.json');
let PluginLoader = Plugin.default;

class TestController {


    public setServer = (server) => {

    };

    public init = (next) => {

        next();
    };


}

let config:any = {
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
const plugin:any = new PluginLoader(config);
export = plugin;
