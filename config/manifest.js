"use strict";
var Config = require('config');
var GoodConsole = require('good-console');
var manifest = {
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
            plugin: './lib/role'
        },
        {
            plugin: './lib/user'
        },
        {
            plugin: './lib/category'
        }
    ]
};
module.exports = manifest;
