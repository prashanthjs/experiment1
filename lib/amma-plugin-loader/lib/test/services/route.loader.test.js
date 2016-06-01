"use strict";
var Hapi = require('hapi');
var Code = require('code');
var Lab = require('lab');
var Sinon = require('sinon');
var RouteLoader = require('../../services/route.loader');
var lab = exports.lab = Lab.script(), before = lab.before, beforeEach = lab.beforeEach, afterEach = lab.afterEach, after = lab.after, expect = Code.expect, suite = lab.suite, test = lab.test;
var sampleRoute = {
    name: 'test'
};
var sampleRoutes = [sampleRoute];
suite('Route Loader', function () {
    var server = new Hapi.Server();
    var routeLoader = new RouteLoader.default();
    routeLoader.setServer(server);
    test('Load routes', function (next) {
        var stub = Sinon.stub(server, 'route', function (routes) {
            expect(routes).to.deep.equal(sampleRoutes);
        });
        routeLoader.loadRoutes(sampleRoutes);
        stub.restore();
        next();
    });
    test('Load routes - with empty routes', function (next) {
        var stub = Sinon.stub(server, 'route', function (routes) {
            expect(true).to.be.false();
        });
        routeLoader.loadRoutes([]);
        stub.restore();
        next();
    });
    test('Load routes - with null routes', function (next) {
        var stub = Sinon.stub(server, 'route', function (routes) {
            expect(true).to.be.false();
        });
        routeLoader.loadRoutes();
        stub.restore();
        next();
    });
});
