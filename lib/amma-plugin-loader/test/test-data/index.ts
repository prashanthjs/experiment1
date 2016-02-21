import Plugin = require('../../index');
let attributes = require('./package.json');
let PluginLoader = Plugin.default;

class TestController {
    public test = (request, reply) => {
        return reply({});
    };

    public setServer = (server) => {

    };

    public init = (next) => {

        next();
    };

    public testMethod = () => {

    };

}

let config:any = {
    app:{
        'test': 'test'
    },
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
