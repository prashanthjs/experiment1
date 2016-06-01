"use strict";
var Hapi = require('hapi');
var Code = require('code');
var Lab = require('lab');
var Sinon = require('sinon');
var ServiceLoader = require('../../services/service.loader');
var PluginLoader = require('../../services/plugin.loader');
var RouteLoader = require('../../services/route.loader');
var lab = exports.lab = Lab.script(), expect = Code.expect, suite = lab.suite, test = lab.test;
var sampleConfig = {
    'test': 'test'
};
var sampleAppConfig = {
    role: ['test1']
};
var SampleConfig = {
    config: sampleConfig,
    app: sampleAppConfig,
    attributes: {
        pkg: {}
    }
};
var SampleNoAppConfig = {
    config: sampleConfig,
    attributes: {
        pkg: {}
    }
};
suite('Plugin Loader', function () {
    var server = new Hapi.Server();
    var serviceLoader = new ServiceLoader.default();
    var routeLoader = new RouteLoader.default();
    test('Load Services - with server method', function (next) {
        var pluginLoader = new PluginLoader.default(SampleConfig);
        pluginLoader.setRouteLoader(routeLoader);
        pluginLoader.setServiceLoader(serviceLoader);
        var stub = Sinon.stub(server, 'bind', function (cls) {
            expect(cls).to.deep.equal(pluginLoader);
        });
        var stub1 = Sinon.stub(server, 'expose', function (key, config) {
            expect(config).to.deep.equal(SampleConfig);
        });
        var stub2 = Sinon.stub(serviceLoader, 'setServer', function (serverObj) {
            expect(serverObj).to.deep.equal(server);
        });
        var stub3 = Sinon.stub(routeLoader, 'setServer', function (serverObj) {
            expect(serverObj).to.deep.equal(server);
        });
        var stub4 = Sinon.stub(serviceLoader, 'loadServices', function (serviceConfig, done) {
            done();
        });
        var stub5 = Sinon.stub(routeLoader, 'loadRoutes', function (serviceConfig, done) {
        });
        var spy = Sinon.spy(function () {
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
    test('Load Services - with server method', function (next) {
        server.settings.app = {
            role: ['test2'],
            'test2': 'test2'
        };
        var pluginLoader = new PluginLoader.default(SampleConfig);
        pluginLoader.setRouteLoader(routeLoader);
        pluginLoader.setServiceLoader(serviceLoader);
        var stub = Sinon.stub(server, 'bind', function (cls) {
            expect(cls).to.deep.equal(pluginLoader);
        });
        var stub1 = Sinon.stub(server, 'expose', function (key, config) {
            expect(config).to.deep.equal(SampleConfig);
        });
        var stub2 = Sinon.stub(serviceLoader, 'setServer', function (serverObj) {
            expect(serverObj).to.deep.equal(server);
        });
        var stub3 = Sinon.stub(routeLoader, 'setServer', function (serverObj) {
            expect(serverObj).to.deep.equal(server);
        });
        var stub4 = Sinon.stub(serviceLoader, 'loadServices', function (serviceConfig, done) {
            done();
        });
        var stub5 = Sinon.stub(routeLoader, 'loadRoutes', function (serviceConfig, done) {
        });
        var spy = Sinon.spy(function () {
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
    test('Load Services - no app', function (next) {
        server.settings.app = {};
        var pluginLoader = new PluginLoader.default(SampleNoAppConfig);
        pluginLoader.setRouteLoader(routeLoader);
        pluginLoader.setServiceLoader(serviceLoader);
        var stub = Sinon.stub(server, 'bind', function (cls) {
            expect(cls).to.deep.equal(pluginLoader);
        });
        var stub1 = Sinon.stub(server, 'expose', function (key, config) {
            expect(config).to.deep.equal(SampleNoAppConfig);
        });
        var stub2 = Sinon.stub(serviceLoader, 'setServer', function (serverObj) {
            expect(serverObj).to.deep.equal(server);
        });
        var stub3 = Sinon.stub(routeLoader, 'setServer', function (serverObj) {
            expect(serverObj).to.deep.equal(server);
        });
        var stub4 = Sinon.stub(serviceLoader, 'loadServices', function (serviceConfig, done) {
            done();
        });
        var stub5 = Sinon.stub(routeLoader, 'loadRoutes', function (serviceConfig, done) {
        });
        var spy = Sinon.spy(function () {
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
