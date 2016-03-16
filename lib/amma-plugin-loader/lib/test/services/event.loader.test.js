var Hapi = require('hapi');
var Code = require('code');
var Lab = require('lab');
var Sinon = require('sinon');
var EventLoader = require('../../services/event.loader');
var lab = exports.lab = Lab.script(), expect = Code.expect, before = lab.before, suite = lab.suite, test = lab.test;
var SampleClass = (function () {
    function SampleClass() {
        this.method = function () {
        };
    }
    return SampleClass;
})();
var SampleConfig = [{
    methodName: 'method',
    type: 'onRequest',
    options: {}
}];
suite('Event Loader', function () {
    var server = new Hapi.Server();
    var eventLoader = new EventLoader.default();
    var cls = new SampleClass();
    before(function (next) {
        eventLoader.setServer(server);
        next();
    });
    test('Load Events', function (next) {
        var cls = new SampleClass();
        var stub = Sinon.stub(server, 'ext', function (type, func, options) {
            expect(type).to.be.equal('onRequest');
            expect(func).to.be.equal(cls.method);
        });
        eventLoader.loadEvents(cls, SampleConfig);
        stub.restore();
        next();
    });
    test('Load Events null', function (next) {
        var stub = Sinon.stub(server, 'ext', function (type, func, options) {
            expect(true).to.be.false();
        });
        eventLoader.loadEvents(cls);
        stub.restore();
        next();
    });
});
