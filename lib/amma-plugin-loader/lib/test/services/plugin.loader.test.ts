import Hapi = require('hapi');
import Code = require('code');
import Lab = require('lab');
import Sinon = require('sinon');
import EventLoader = require('../../services/event.loader');
import HandlerLoader = require ('../../services/handler.loader');
import ServiceLoader = require ('../../services/service.loader');
import PluginLoader = require ('../../services/plugin.loader');
import RouteLoader = require ('../../services/route.loader');

const lab = exports.lab = Lab.script(),
    expect = Code.expect,
    suite = lab.suite,
    test = lab.test;

const sampleConfig = {
    'test': 'test'
};

const sampleAppConfig = {
    role: ['test1']
};
const SampleConfig = {
    config: sampleConfig,
    app: sampleAppConfig,
    attributes: {
        pkg: {}
    }
};

const SampleNoAppConfig = {
    config: sampleConfig,
    attributes: {
        pkg: {}
    }
};

suite('Plugin Loader', () => {
    const server = new Hapi.Server();
    const serviceLoader = new ServiceLoader.default();
    const routeLoader = new RouteLoader.default();


    test('Load Services - with server method', (next) => {
        const pluginLoader = new PluginLoader.default(SampleConfig);
        pluginLoader.setRouteLoader(routeLoader);
        pluginLoader.setServiceLoader(serviceLoader);

        const stub = Sinon.stub(server, 'bind', (cls)=> {
            expect(cls).to.deep.equal(pluginLoader);
        });

        const stub1 = Sinon.stub(server, 'expose', (key, config)=> {
            expect(config).to.deep.equal(SampleConfig);
        });

        const stub2 = Sinon.stub(serviceLoader, 'setServer', (serverObj)=> {
            expect(serverObj).to.deep.equal(server);
        });
        const stub3 = Sinon.stub(routeLoader, 'setServer', (serverObj)=> {
            expect(serverObj).to.deep.equal(server);
        });

        const stub4 = Sinon.stub(serviceLoader, 'loadServices', (serviceConfig, done)=> {
            done();
        });
        const stub5 = Sinon.stub(routeLoader, 'loadRoutes', (serviceConfig, done)=> {

        });

        const spy = Sinon.spy(()=> {

            expect(server.settings.app).to.deep.equal(sampleAppConfig);
            stub.restore();
            stub1.restore();
            stub2.restore();
            stub3.restore();
            stub4.restore();
            stub5.restore();
            next();
        });

        pluginLoader.register(server, {}, spy);
    });

    test('Load Services - with server method', (next) => {
        server.settings.app = {
            role: ['test2'],
            'test2': 'test2'
        };
        const pluginLoader = new PluginLoader.default(SampleConfig);
        pluginLoader.setRouteLoader(routeLoader);
        pluginLoader.setServiceLoader(serviceLoader);

        const stub = Sinon.stub(server, 'bind', (cls)=> {
            expect(cls).to.deep.equal(pluginLoader);
        });

        const stub1 = Sinon.stub(server, 'expose', (key, config)=> {
            expect(config).to.deep.equal(SampleConfig);
        });

        const stub2 = Sinon.stub(serviceLoader, 'setServer', (serverObj)=> {
            expect(serverObj).to.deep.equal(server);
        });
        const stub3 = Sinon.stub(routeLoader, 'setServer', (serverObj)=> {
            expect(serverObj).to.deep.equal(server);
        });

        const stub4 = Sinon.stub(serviceLoader, 'loadServices', (serviceConfig, done)=> {
            done();
        });
        const stub5 = Sinon.stub(routeLoader, 'loadRoutes', (serviceConfig, done)=> {

        });

        const spy = Sinon.spy(()=> {
            expect(server.settings.app).to.deep.equal({
                'role': ['test1', 'test2'],
                'test2': 'test2'
            });
            stub.restore();
            stub1.restore();
            stub2.restore();
            stub3.restore();
            stub4.restore();
            stub5.restore();
            next();
        });

        pluginLoader.register(server, {}, spy);
    });
    test('Load Services - no app', (next) => {
        server.settings.app = {};

        const pluginLoader = new PluginLoader.default(SampleNoAppConfig);
        pluginLoader.setRouteLoader(routeLoader);
        pluginLoader.setServiceLoader(serviceLoader);

        const stub = Sinon.stub(server, 'bind', (cls)=> {
            expect(cls).to.deep.equal(pluginLoader);
        });

        const stub1 = Sinon.stub(server, 'expose', (key, config)=> {
            expect(config).to.deep.equal(SampleNoAppConfig);
        });

        const stub2 = Sinon.stub(serviceLoader, 'setServer', (serverObj)=> {
            expect(serverObj).to.deep.equal(server);
        });
        const stub3 = Sinon.stub(routeLoader, 'setServer', (serverObj)=> {
            expect(serverObj).to.deep.equal(server);
        });

        const stub4 = Sinon.stub(serviceLoader, 'loadServices', (serviceConfig, done)=> {
            done();
        });
        const stub5 = Sinon.stub(routeLoader, 'loadRoutes', (serviceConfig, done)=> {

        });

        const spy = Sinon.spy(()=> {
            expect(server.settings.app).to.be.empty();
            stub.restore();
            stub1.restore();
            stub2.restore();
            stub3.restore();
            stub4.restore();
            stub5.restore();
            next();
        });

        pluginLoader.register(server, {}, spy);
    });


});