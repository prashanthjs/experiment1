var Hapi = require('hapi');
var Code = require('code');
var Lab = require('lab');
var TestModule = require('./test-data/index');
var lab = exports.lab = Lab.script(), before = lab.before, beforeEach = lab.beforeEach, afterEach = lab.afterEach, after = lab.after, expect = Code.expect, suite = lab.suite, test = lab.test;
suite('Plugin Loader', function () {
    var server = new Hapi.Server();
    server.connection({ port: 15000 });
    test('Load file', function (next) {
        server.register({ register: TestModule }, function (err) {
            expect(err).to.equal(undefined);
            next();
        });
    });
    test('test App', function (next) {
        expect(server.settings.app).to.be.exist();
        next();
    });
    test('Test methods', function (next) {
        expect(server.methods['testMethod']).to.be.exist();
        next();
    });
    test('Test handler and routes', function (next) {
        var table = server.table();
        expect(table).to.have.length(1);
        var options = {
            method: 'GET',
            url: '/test'
        };
        server.inject(options, function (response) {
            var result = response.result;
            expect(response.statusCode).to.equal(200);
            expect(result).to.be.empty();
            return next();
        });
    });
});
