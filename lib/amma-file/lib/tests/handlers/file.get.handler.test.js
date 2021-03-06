"use strict";
var Hapi = require('hapi');
var Code = require('code');
var Lab = require('lab');
var Sinon = require('sinon');
var ObjectPath = require('object-path');
var FileManager = require('../../services/file.manager');
var FileHelper = require('../../services/file.helper');
var FileFactory = require("../../services/file.factory");
var FileGetHandler = require("../../handlers/file.get.handler");
var TestData = require('./data/test-data');
var lab = exports.lab = Lab.script(), before = lab.before, beforeEach = lab.beforeEach, afterEach = lab.afterEach, after = lab.after, expect = Code.expect, suite = lab.suite, test = lab.test;
suite('File Get Handler', function () {
    var server = new Hapi.Server();
    var fileGetHandler = new FileGetHandler.default();
    var fileFactory = new FileFactory.default();
    var fileManager = new FileManager.default();
    var fileOptions = TestData.default.fileOptions;
    var options = TestData.default.options;
    var request = TestData.default.request;
    var fileHelper = new FileHelper.default(fileManager, fileOptions, null, null);
    before(function (next) {
        fileGetHandler.setServer(server);
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
        var files = ['test1.jpg'];
        var stub = Sinon.stub(fileHelper, 'getSrcFiles', function () {
            return files;
        });
        var spy = Sinon.spy(function (fls) {
            stub.restore();
            expect(spy.called).to.true();
            expect(fls).to.deep.equal({ files: files });
            next();
        });
        var result = fileGetHandler.handlerInit(request, options);
        result(request, spy);
    });
    afterEach(function (next) {
        stub.restore();
        next();
    });
});
