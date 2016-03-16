var Hapi = require('hapi');
var Code = require('code');
var Lab = require('lab');
var Sinon = require('sinon');
var MethodLoader = require('../../services/method.loader');
var lab = exports.lab = Lab.script(), before = lab.before, beforeEach = lab.beforeEach, afterEach = lab.afterEach, after = lab.after, expect = Code.expect, suite = lab.suite, test = lab.test;
var SampleClass = (function () {
    function SampleClass() {
        this.method = function () {
        };
    }
    return SampleClass;
})();
var SampleConfig = [{
    methodName: 'method',
    name: 'name',
    options: {}
}];
suite('Method Loader', function () {
    var server = new Hapi.Server();
    var methodLoader = new MethodLoader.default();
    methodLoader.setServer(server);
    test('Load method', function (next) {
        var cls = new SampleClass();
        var stub = Sinon.stub(server, 'method', function (name, func, options) {
            expect(name).to.be.equal('name');
            expect(func).to.be.equal(cls.method);
        });
        methodLoader.loadMethods(cls, SampleConfig);
        stub.restore();
        next();
    });
    test('Load method', function (next) {
        var cls = new SampleClass();
        var stub = Sinon.stub(server, 'method', function (name, func, options) {
            expect(true).to.be.false();
        });
        methodLoader.loadMethods(cls);
        stub.restore();
        next();
    });
});
