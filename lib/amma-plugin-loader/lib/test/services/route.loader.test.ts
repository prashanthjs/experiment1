import Hapi = require('hapi');
import Code = require('code');
import Lab = require('lab');
import Sinon = require('sinon');
import RouteLoader = require('../../services/route.loader');

let lab = exports.lab = Lab.script(),
    before = lab.before,
    beforeEach = lab.beforeEach,
    afterEach = lab.afterEach,
    after = lab.after,
    expect = Code.expect,
    suite = lab.suite,
    test = lab.test;

const sampleRoute = {
    name: 'test'
};
const sampleRoutes = [sampleRoute];

suite('Route Loader', () => {
    const server = new Hapi.Server();
    const routeLoader = new RouteLoader.default();
    routeLoader.setServer(server);
    test('Load routes', (next) => {
        const stub = Sinon.stub(server, 'route', (routes) => {
            expect(routes).to.deep.equal(sampleRoutes);
        });
        routeLoader.loadRoutes(sampleRoutes);
        stub.restore();
        next();
    });

    test('Load routes - with empty routes', (next) => {
        const stub = Sinon.stub(server, 'route', (routes) => {
            expect(true).to.be.false();
        });
        routeLoader.loadRoutes([]);
        stub.restore();
        next();
    });

    test('Load routes - with null routes', (next) => {
        const stub = Sinon.stub(server, 'route', (routes) => {
            expect(true).to.be.false();
        });
        routeLoader.loadRoutes();
        stub.restore();
        next();
    });

});