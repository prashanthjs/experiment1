var Hapi = require('hapi');
var Code = require('code');
var Lab = require('lab');
var Sinon = require('sinon');
var ObjectPath = require('object-path');
var FileManager = require('../../services/file.manager');
var FileHelper = require('../../services/file.helper');
var FileFactory = require("../../services/file.factory");
var FileUploadHandler = require("../../handlers/file.upload.handler");
var TestData = require('./data/test-data');
var lab = exports.lab = Lab.script(), before = lab.before, beforeEach = lab.beforeEach, afterEach = lab.afterEach, after = lab.after, expect = Code.expect, suite = lab.suite, test = lab.test;
suite('File Upload Handler', function () {
    var server = new Hapi.Server();
    var fileUploadHandler = new FileUploadHandler.default();
    var fileFactory = new FileFactory.default();
    var fileManager = new FileManager.default();
    var fileOptions = TestData.default.fileOptions;
    var options = TestData.default.options;
    var request = TestData.default.request;
    var fileHelper = new FileHelper.default(fileManager, fileOptions, null, null);
    before(function (next) {
        fileUploadHandler.setServer(server);
        ObjectPath.ensureExists(server, 'settings.app.services', {});
        server.settings.app.services.fileFactory = fileFactory;
        server.settings.app.services.fileManager = fileManager;
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
        var stub = Sinon.stub(fileHelper, 'upload', function (file, fileName, callback) {
            expect(fileName).to.be.equal(request.payload.file.hapi.filename);
            expect(file).to.only.include(request.payload.file);
            callback(null, {
                filename: request.payload.file.hapi.filename
            });
        });
        var spy = Sinon.spy(function (result) {
            stub.restore();
            expect(spy.called).to.true();
            expect(result.filename).to.be.equal(request.payload.file.hapi.filename);
            expect(result.headers).to.only.include(request.payload.file.hapi.headers);
            next();
        });
        var result = fileUploadHandler.handlerInit(request, options);
        result(request, spy);
    });
    test('Handler - failure', function (next) {
        var stub = Sinon.stub(fileHelper, 'upload', function (file, fileName, callback) {
            expect(fileName).to.be.equal(request.payload.file.hapi.filename);
            expect(file).to.only.include(request.payload.file);
            callback('error');
        });
        var spy = Sinon.spy(function (result) {
            stub.restore();
            expect(spy.called).to.true();
            expect(result.filename).not.to.be.exist();
            next();
        });
        var result = fileUploadHandler.handlerInit(request, options);
        result(request, spy);
    });
    afterEach(function (next) {
        stub.restore();
        next();
    });
});
