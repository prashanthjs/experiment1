"use strict";
var Hapi = require('hapi');
var Code = require('code');
var Lab = require('lab');
var Sinon = require('sinon');
var ObjectPath = require('object-path');
var Boom = require('boom');
var Handler = require('../../handlers/crud.get.handler');
var DocumentServiceFactory = require('../../services/document.service.factory');
var DocumentService = require('../../services/document.service');
var lab = exports.lab = Lab.script(), before = lab.before, after = lab.after, expect = Code.expect, suite = lab.suite, test = lab.test;
suite('Crud Get By Id Handler', function () {
    var server = new Hapi.Server();
    var curdCoreHandler = new Handler.default();
    var documentServiceFactory = new DocumentServiceFactory.default();
    var documentService = new DocumentService.default();
    var options = {
        collectionName: 'test',
        schema: {},
        idPath: 'params.id'
    };
    var stub;
    before(function (next) {
        curdCoreHandler.setServer(server);
        documentService.setServer(server);
        documentServiceFactory.setServer(server);
        stub = Sinon.stub(documentServiceFactory, 'getDocumentService', function () {
            return documentService;
        });
        ObjectPath.ensureExists(server, 'settings.app.services', {});
        server.settings.app.services.documentServiceFactory = documentServiceFactory;
        next();
    });
    test('Handler', function (next) {
        var sampleJson = { _id: 'test' };
        var route = {};
        var result = curdCoreHandler.handlerInit(route, options);
        expect(result).to.be.a.function();
        var stub = Sinon.stub(documentService, 'findById', function (id, projs, callback) {
            expect(id).to.be.equal(10);
            callback(null, sampleJson);
        });
        var spy = Sinon.spy(function (res) {
            stub.restore();
            expect(res).to.deep.equal(sampleJson);
            expect(spy.called).to.be.true();
            next();
        });
        var request = {
            params: {
                id: 10
            }
        };
        result(request, spy);
    });
    test('Handler - not found', function (next) {
        var route = {};
        var result = curdCoreHandler.handlerInit(route, options);
        expect(result).to.be.a.function();
        var stub = Sinon.stub(documentService, 'findById', function (id, projs, callback) {
            callback(null, null);
        });
        var spy = Sinon.spy(function (res) {
            stub.restore();
            expect(spy.calledWith(Boom.notFound('Not found'))).to.be.true();
            expect(spy.called).to.be.true();
            next();
        });
        var request = {
            params: {
                id: 10
            }
        };
        result(request, spy);
    });
    test('Handler - error', function (next) {
        var route = {};
        var result = curdCoreHandler.handlerInit(route, options);
        expect(result).to.be.a.function();
        var stub = Sinon.stub(documentService, 'findById', function (id, projs, callback) {
            callback('error');
        });
        var spy = Sinon.spy(function () {
            stub.restore();
            expect(spy.calledWith(Boom.badImplementation('error'))).to.be.true();
            expect(spy.called).to.be.true();
            next();
        });
        var request = {
            params: {
                id: 10
            }
        };
        result(request, spy);
    });
    after(function (next) {
        stub.restore();
        next();
    });
});
