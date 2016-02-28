var Hapi = require('hapi');
var Code = require('code');
var Lab = require('lab');
var Sinon = require('sinon');
var ObjectPath = require('object-path');
var FileManager = require('../../services/file.manager');
var FileHelper = require('../../services/file.helper');
var FileFactory = require("../../services/file.factory");
var FileTokenHandler = require("../../handlers/file.token.handler");
var TestData = require('./data/test-data');
var lab = exports.lab = Lab.script(), before = lab.before, beforeEach = lab.beforeEach, afterEach = lab.afterEach, after = lab.after, expect = Code.expect, suite = lab.suite, test = lab.test;
suite('File Token Handler', function () {
    var server = new Hapi.Server();
    var fileTokenHandler = new FileTokenHandler.default();
    var fileFactory = new FileFactory.default();
    var fileManager = new FileManager.default();
    var fileOptions = TestData.default.fileOptions;
    var options = TestData.default.options;
    var request = TestData.default.request;
    var fileHelper = new FileHelper.default(fileManager, fileOptions, null, null);
    before(function (next) {
        fileTokenHandler.setServer(server);
        ObjectPath.ensureExists(server, 'settings.app.services', {});
        server.settings.app.services.fileFactory = fileFactory;
        server.settings.app.services.fileManager = fileManager;
        next();
    });
    test('Handler - success', function (next) {
        var stub = Sinon.stub(fileFactory, 'getInstance', function () {
            return fileHelper;
        });
        var stub2 = Sinon.stub(fileHelper, 'syncSrcToTemp', function (callback) {
            callback();
        });
        var spy = Sinon.spy(function (json) {
            stub.restore();
            stub2.restore();
            expect(spy.called).to.true();
            expect(json.token).to.be.exist();
            next();
        });
        var result = fileTokenHandler.handlerInit(request, options);
        result(request, spy);
    });
    test('Handler - failure', function (next) {
        var stub = Sinon.stub(fileFactory, 'getInstance', function () {
            return fileHelper;
        });
        var stub2 = Sinon.stub(fileHelper, 'syncSrcToTemp', function (callback) {
            callback('error');
        });
        var spy = Sinon.spy(function (boom) {
            stub.restore();
            stub2.restore();
            expect(spy.called).to.true();
            expect(boom.token).not.to.be.exist();
            next();
        });
        var result = fileTokenHandler.handlerInit(request, options);
        result(request, spy);
    });
    test('Handler - success - remove token', function (next) {
        delete options.tokenPath;
        var stub = Sinon.stub(fileFactory, 'getInstance', function () {
            return fileHelper;
        });
        var stub2 = Sinon.stub(fileHelper, 'syncSrcToTemp', function (callback) {
            callback();
        });
        var spy = Sinon.spy(function (json) {
            stub.restore();
            stub2.restore();
            expect(spy.called).to.true();
            expect(json.token).to.be.exist();
            next();
        });
        var request = {};
        var result = fileTokenHandler.handlerInit(request, options);
        result(request, spy);
    });
});
