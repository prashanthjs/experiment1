"use strict";
var Hapi = require('hapi');
var Code = require('code');
var Lab = require('lab');
var Sinon = require('sinon');
var ObjectPath = require('object-path');
var Boom = require('boom');
var Handler = require('../../handlers/crud.remove.handler');
var DocumentServiceFactory = require('../../services/document.service.factory');
var DocumentService = require('../../services/document.service');
var lab = exports.lab = Lab.script(), before = lab.before, after = lab.after, expect = Code.expect, suite = lab.suite, test = lab.test;
suite('Crud Remove By Id Handler', function () {
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
        var route = {};
        var result = curdCoreHandler.handlerInit(route, options);
        expect(result).to.be.a.function();
        var stub = Sinon.stub(documentService, 'findByIdAndRemove', function (id, callback) {
            expect(id).to.be.equal(10);
            callback();
        });
        var spy = Sinon.spy(function (res) {
            stub.restore();
            expect(res).to.be.deep.equal({});
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
        var stub = Sinon.stub(documentService, 'findByIdAndRemove', function (id, callback) {
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
