"use strict";
var Hapi = require('hapi');
var Code = require('code');
var Lab = require('lab');
var Sinon = require('sinon');
var Joi = require('joi');
var ObjectPath = require('object-path');
var FileCoreHandler = require('../../handlers/file.core.handler');
var FileManager = require('../../services/file.manager');
var FileHelper = require('../../services/file.helper');
var FileFactory = require("../../services/file.factory");
var TestData = require('./data/test-data');
var lab = exports.lab = Lab.script(), before = lab.before, expect = Code.expect, suite = lab.suite, test = lab.test;
suite('File Core Handler', function () {
    var server = new Hapi.Server();
    var fileCoreHandler = new FileCoreHandler.default();
    var fileFactory = new FileFactory.default();
    var fileManager = new FileManager.default();
    var fileOptions = TestData.default.fileOptions;
    var options = TestData.default.options;
    var request = TestData.default.request;
    before(function (next) {
        fileCoreHandler.setServer(server);
        ObjectPath.ensureExists(server, 'settings.app.services', {});
        server.settings.app.services.fileFactory = fileFactory;
        server.settings.app.services.fileManager = fileManager;
        next();
    });
    test('Handler Init ', function (next) {
        var options = { 'test': 'test' };
        var stub = Sinon.stub(Joi, 'attempt', function (opts, schema, message) {
            expect(opts).to.be.only.include(options);
            return opts;
        });
        var route = {};
        var result = fileCoreHandler.handlerInit(route, options);
        stub.restore();
        expect(result).to.be.a.function();
        next();
    });
    test('Handler', function (next) {
        var spy = Sinon.spy(function () {
            expect(spy.called).to.be.true();
            next();
        });
        fileCoreHandler.handler(request, spy);
    });
    test('Get ExtPath - success ', function (next) {
        var stub = Sinon.stub(ObjectPath, 'has', function () {
            return true;
        });
        var stub1 = Sinon.stub(ObjectPath, 'get', function () {
            return 'test1';
        });
        var result = fileCoreHandler.getExtpath(request);
        expect(result).to.be.equal('test1');
        stub.restore();
        stub1.restore();
        next();
    });
    test('Get ExtPath - failure ', function (next) {
        var stub = Sinon.stub(ObjectPath, 'has', function () {
            return false;
        });
        var request = {};
        var result = fileCoreHandler.getExtpath(request);
        expect(result).to.be.null();
        stub.restore();
        next();
    });
    test('Get Token - success ', function (next) {
        var stub = Sinon.stub(ObjectPath, 'has', function () {
            return true;
        });
        var stub1 = Sinon.stub(ObjectPath, 'get', function () {
            return 'test1';
        });
        var result = fileCoreHandler.getToken(request);
        expect(result).to.be.equal('test1');
        stub.restore();
        stub1.restore();
        next();
    });
    test('Get Token - failure ', function (next) {
        var stub = Sinon.stub(ObjectPath, 'has', function () {
            return false;
        });
        var result = fileCoreHandler.getToken(request);
        expect(result).to.be.null();
        stub.restore();
        next();
    });
    test('Get File Helper Instance', function (next) {
        var fileHelper = new FileHelper.default(fileManager, fileOptions, 'test', 'test');
        var stub = Sinon.stub(fileFactory, 'getInstance', function () {
            return fileHelper;
        });
        var result = fileCoreHandler.getFileHelperInstance(request);
        expect(result).to.be.an.instanceOf(FileHelper.default);
        stub.restore();
        next();
    });
});
