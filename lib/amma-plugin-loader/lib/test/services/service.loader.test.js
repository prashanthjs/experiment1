var Hapi = require('hapi');
var Code = require('code');
var Lab = require('lab');
var Sinon = require('sinon');
var EventLoader = require('../../services/event.loader');
var MethodLoader = require('../../services/method.loader');
var HandlerLoader = require('../../services/handler.loader');
var ServiceLoader = require('../../services/service.loader');
var lab = exports.lab = Lab.script(), before = lab.before, expect = Code.expect, suite = lab.suite, test = lab.test;
var SampleClassWithServerMethod = (function () {
    function SampleClassWithServerMethod() {
    }

    SampleClassWithServerMethod.prototype.setServer = function (server) {
        this.server = server;
    };
    return SampleClassWithServerMethod;
})();
var SampleClassWithInit = (function () {
    function SampleClassWithInit() {
    }

    SampleClassWithInit.prototype.init = function (next) {
        next();
    };
    return SampleClassWithInit;
})();
var SampleClassWithServerMethodConfig = [{
    cls: SampleClassWithServerMethod,
    name: 'testService'
}];
var SampleClassWithServerMethodInitConfig = [{
    cls: SampleClassWithInit
}];
suite('Service Loader', function () {
    var server = new Hapi.Server();
    var methodLoader = new MethodLoader.default();
    var eventLoader = new EventLoader.default();
    var handlerLoader = new HandlerLoader.default();
    var serviceLoader = new ServiceLoader.default();
    before(function (next) {
        serviceLoader.setEventLoader(eventLoader);
        serviceLoader.setMethodLoader(methodLoader);
        serviceLoader.setHandlerLoader(handlerLoader);
        serviceLoader.setServer(server);
        next();
    });
    test('Load Services - with server method', function (next) {
        var spy = Sinon.spy(function () {
            expect(server.settings.app.services.testService).to.be.an.object();
            expect(spy.called).to.be.true();
            next();
        });
        serviceLoader.loadServices(SampleClassWithServerMethodConfig, spy);
    });
    test('Load Services - with init method', function (next) {
        var spy = Sinon.spy(function () {
            expect(spy.called).to.be.true();
            next();
        });
        serviceLoader.loadServices(SampleClassWithServerMethodInitConfig, spy);
    });
    test('Load Services - with empty array', function (next) {
        var spy = Sinon.spy(function () {
            expect(spy.called).to.be.true();
            next();
        });
        serviceLoader.loadServices([], spy);
    });
});
