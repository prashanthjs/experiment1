import Glue = require('glue');
import Config = require('config');
import GoodConsole = require('good-console');


let manifest = {
    server: {
        debug: {
            request: ['error']
        },
        connections: {
            routes: {
                cors: Config.get('cors')
            }
        },
        app: {
            db: Config.get('db')
        }
    },
    connections: [{
        port: Config.get('port'),
        host: Config.get('host')
    }],
    registrations: [
        {
            plugin: 'inert'
        },
        {
            plugin: {
                register: 'good',
                options: {
                    reporters: [{
                        reporter: GoodConsole,
                        events: {
                            request: '*',
                            error: '*',
                            log: '*'
                        }
                    }]
                }
            }
        },
        {
            plugin: 'halacious'
        },
        {
            plugin: './lib/amma-db'
        },
        {
            plugin: './lib/amma-db-parser'
        },
        {
            plugin: './lib/amma-file'
        },
        {
            plugin: './lib/amma-crud'
        },
        {
            plugin: './lib/store'
        },
        {
            plugin: './lib/user'
        }

    ]
};
export = manifest;
