import Hapi = require('hapi');


// Create a server with a host and port
const server = new Hapi.Server({
    app: {
        db: {
            uri: 'mongodb://localhost/test',
            options: {}
        }
    }
});
server.connection({
    host: 'localhost',
    port: 9090
});

// Add the route
server.route({
    method: 'GET',
    path: '/hello',
    handler: function (request, reply) {

        return reply('hello world');
    }
});
server.register([require('./lib/amma-db'), require('./lib/amma-db-parser'), require('./lib/amma-event-emitter')], (err) => {
    if (err) {
        console.error('Failed to load plugin:', err);
    } else {
        server.start((err) => {

            console.log('Server running at:', server.info.uri);
        });
    }
});

