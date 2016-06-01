"use strict";
var Hapi = require('hapi');
var Code = require('code');
var Lab = require('lab');
var Sinon = require('sinon');
var HandlerLoader = require('../../services/handler.loader');
var lab = exports.lab = Lab.script(), expect = Code.expect, suite = lab.suite, test = lab.test;
var SampleClass = (function () {
    function SampleClass() {
        this.method = function () {
        };
    }
    return SampleClass;
}());
var SampleConfig = [{
        methodName: 'method',
        name: 'name',
    }];
suite('Handler Loader', function () {
    var server = new Hapi.Server();
    var cls = new SampleClass();
    var handlerLoader = new HandlerLoader.default();
    handlerLoader.setServer(server);
    test('Load handler', function (next) {
        var cls = new SampleClass();
        var stub = Sinon.stub(server, 'handler', function (name, func) {
            expect(name).to.be.equal('name');
            expect(func).to.be.equal(cls.method);
        });
        handlerLoader.loadHandlers(cls, SampleConfig);
        stub.restore();
        next();
    });
    test('Load handlers - null', function (next) {
        var stub = Sinon.stub(server, 'handler', function (name, func) {
            expect(true).to.be.false();
        });
        handlerLoader.loadHandlers(cls);
        stub.restore();
        next();
    });
});
