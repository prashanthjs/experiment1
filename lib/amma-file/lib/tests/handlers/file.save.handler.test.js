var Hapi = require('hapi');
var Code = require('code');
var Lab = require('lab');
var Sinon = require('sinon');
var FileManager = require('../../services/file.manager');
var FileHelper = require('../../services/file.helper');
var FileFactory = require("../../services/file.factory");
var FileSaveHandler = require("../../handlers/file.save.handler");
var TestData = require('./data/test-data');
var lab = exports.lab = Lab.script(), before = lab.before, beforeEach = lab.beforeEach, afterEach = lab.afterEach, after = lab.after, expect = Code.expect, suite = lab.suite, test = lab.test;
suite('File Save Handler', function () {
    var server = new Hapi.Server();
    var fileSaveHandler = new FileSaveHandler.default();
    var fileFactory = new FileFactory.default();
    var fileManager = new FileManager.default();
    var fileOptions = TestData.default.fileOptions;
    var options = TestData.default.options;
    var request = TestData.default.request;
    var fileHelper = new FileHelper.default(fileManager, fileOptions, null, null);
    before(function (next) {
        fileSaveHandler.setServer(server);
        server.plugins = {
            'amma-file': {
                fileFactory: fileFactory,
                fileManager: fileManager,
            }
        };
        fileFactory.setServer(server);
        next();
    });
    var stub;
    beforeEach(function (next) {
        stub = Sinon.stub(fileFactory, 'getInstance', function () {
            return fileHelper;
        });
        next();
    });
    test('Handler - success', function (next) {
        var stub = Sinon.stub(fileHelper, 'syncSrcToTemp', function (callback) {
            callback();
        });
        var spy = Sinon.spy(function (result) {
            stub.restore();
            expect(spy.called).to.true();
            expect(result.success).to.be.true();
            next();
        });
        var result = fileSaveHandler.handlerInit(request, options);
        result(request, spy);
    });
    test('Handler - failure', function (next) {
        var stub = Sinon.stub(fileHelper, 'syncSrcToTemp', function (callback) {
            callback('error');
        });
        var spy = Sinon.spy(function (result) {
            stub.restore();
            expect(spy.called).to.true();
            expect(result.success).not.to.be.exist();
            next();
        });
        var result = fileSaveHandler.handlerInit(request, options);
        result(request, spy);
    });
    afterEach(function (next) {
        stub.restore();
        next();
    });
});
