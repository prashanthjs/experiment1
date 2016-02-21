import Hapi = require('hapi');
import Code = require('code');
import Lab = require('lab');
import Sinon = require('sinon');
import TestModule = require('./test-data/index');
import TestServiceErrorModule = require('./test-data/service.error.index');

let lab = exports.lab = Lab.script(),
    before = lab.before,
    beforeEach = lab.beforeEach,
    afterEach = lab.afterEach,
    after = lab.after,
    expect = Code.expect,
    suite = lab.suite,
    test = lab.test;


suite('Plugin Loader', () => {
    const server = new Hapi.Server();
    server.connection({port: 15000});

    test('Load file', (next) => {
        server.register({register: TestModule},  (err) => {
            expect(err).to.equal(undefined);
            next();
        });
    });

    test('test App', (next) => {
        expect(server.settings.app).to.be.exist();
        next();
    });

    test('Test methods', (next) => {
       expect(server.methods['testMethod']).to.be.exist();
        next();
    });
    test('Test handler and routes', (next) => {
        let table = server.table();
        expect(table).to.have.length(1);

        let options:any = {
            method: 'GET',
            url: '/test'
        };
        server.inject(options, (response) => {
            let result = response.result;
            expect(response.statusCode).to.equal(200);
            expect(result).to.be.empty();
            return next();
        });
    });
});