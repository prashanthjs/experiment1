var Code = require('code');
var Lab = require('lab');
var EventEmitterFactory = require('../../services/event.emitter');
var AsyncEventEmitter = require('async-eventemitter');
var lab = exports.lab = Lab.script(), before = lab.before, beforeEach = lab.beforeEach, afterEach = lab.afterEach, after = lab.after, expect = Code.expect, suite = lab.suite, test = lab.test;
suite('Test File upload', function () {
    var EventEmitter;
    before(function (next) {
        EventEmitter = new EventEmitterFactory.default();
        return next();
    });
    test('test get', function (next) {
        var emitter = EventEmitter.get();
        expect(emitter).instanceof(AsyncEventEmitter);
        next();
    });
});
