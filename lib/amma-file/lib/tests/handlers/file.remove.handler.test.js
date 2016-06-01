"use strict";
var Hapi = require('hapi');
var Code = require('code');
var Lab = require('lab');
var Sinon = require('sinon');
var ObjectPath = require('object-path');
var FileManager = require('../../services/file.manager');
var FileHelper = require('../../services/file.helper');
var FileFactory = require("../../services/file.factory");
var FileRemoveHandler = require("../../handlers/file.remove.handler");
var TestData = require('./data/test-data');
var lab = exports.lab = Lab.script(), before = lab.before, beforeEach = lab.beforeEach, afterEach = lab.afterEach, after = lab.after, expect = Code.expect, suite = lab.suite, test = lab.test;
suite('File Remove Handler', function () {
    var server = new Hapi.Server();
    var fileRemoveHandler = new FileRemoveHandler.default();
    var fileFactory = new FileFactory.default();
    var fileManager = new FileManager.default();
    var extPath = 'test';
    var token = 'token';
    var fileOptions = TestData.default.fileOptions;
    var options = TestData.default.options;
    var request = TestData.default.request;
    var fileHelper = new FileHelper.default(fileManager, fileOptions, extPath, token);
    before(function (next) {
        fileRemoveHandler.setServer(server);
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
        var stub = Sinon.stub(fileHelper, 'removeFile', function (fileName) {
            expect(fileName).to.be.equal('test1.jpg');
        });
        var spy = Sinon.spy(function (result) {
            stub.restore();
            expect(spy.called).to.true();
            expect(result.success).to.be.true();
            next();
        });
        var result = fileRemoveHandler.handlerInit(request, options);
        result(request, spy);
    });
    afterEach(function (next) {
        stub.restore();
        next();
    });
});
