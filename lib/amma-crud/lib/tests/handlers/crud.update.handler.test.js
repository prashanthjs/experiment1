var Hapi = require('hapi');
var Code = require('code');
var Lab = require('lab');
var Sinon = require('sinon');
var ObjectPath = require('object-path');
var Boom = require('boom');
var Handler = require('../../handlers/crud.update.handler');
var DocumentServiceFactory = require('../../services/document.service.factory');
var DocumentService = require('../../services/document.service');
var lab = exports.lab = Lab.script(), before = lab.before, after = lab.after, expect = Code.expect, suite = lab.suite, test = lab.test;
suite('Crud Update Handler', function () {
    var server = new Hapi.Server();
    var curdCoreHandler = new Handler.default();
    var documentServiceFactory = new DocumentServiceFactory.default();
    var documentService = new DocumentService.default();
    var options = {
        collectionName: 'test',
        schema: {},
        idPath: 'params._id'
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
        var sampleJson = {_id: 'test'};
        var route = {};
        var result = curdCoreHandler.handlerInit(route, options);
        expect(result).to.be.a.function();
        var stub = Sinon.stub(documentService, 'findByIdAndUpdate', function (id, payload, callback) {
            expect(payload).to.deep.equal(sampleJson);
            expect(id).to.be.equal('test');
            callback(null, sampleJson);
        });
        var stub1 = Sinon.stub(documentService, 'findById', function (id, projs, callback) {
            expect(id).to.be.equal('test');
            callback(null, sampleJson);
        });
        var spy = Sinon.spy(function (res) {
            stub.restore();
            stub1.restore();
            expect(res).to.deep.equal(sampleJson);
            expect(spy.called).to.be.true();
            next();
        });
        var request = {
            params: {
                _id: 'test'
            },
            payload: sampleJson
        };
        result(request, spy);
    });
    test('Handler - save error', function (next) {
        var sampleJson = {_id: 'test'};
        var route = {};
        var result = curdCoreHandler.handlerInit(route, options);
        expect(result).to.be.a.function();
        var stub = Sinon.stub(documentService, 'findByIdAndUpdate', function (id, payload, callback) {
            expect(payload).to.deep.equal(sampleJson);
            expect(id).to.be.equal('test');
            callback('error');
        });
        var stub1 = Sinon.stub(documentService, 'findById', function (id, projs, callback) {
            expect(id).to.be.equal('test');
            callback(null, sampleJson);
        });
        var spy = Sinon.spy(function (res) {
            stub.restore();
            stub1.restore();
            expect(spy.calledWith(Boom.forbidden('error'))).to.be.true();
            expect(spy.called).to.be.true();
            next();
        });
        var request = {
            params: {
                _id: 'test'
            },
            payload: sampleJson
        };
        result(request, spy);
    });
    test('Handler - id not found', function (next) {
        var sampleJson = {_id: 'test'};
        var route = {};
        var result = curdCoreHandler.handlerInit(route, options);
        expect(result).to.be.a.function();
        var stub = Sinon.stub(documentService, 'findById', function (id, projs, callback) {
            expect(id).to.be.equal('test');
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
                _id: 'test'
            },
            payload: sampleJson
        };
        result(request, spy);
    });
    test('Handler - first call error', function (next) {
        var sampleJson = {_id: 'test'};
        var route = {};
        var result = curdCoreHandler.handlerInit(route, options);
        expect(result).to.be.a.function();
        var stub = Sinon.stub(documentService, 'findById', function (id, projs, callback) {
            expect(id).to.be.equal('test');
            callback('error', null);
        });
        var spy = Sinon.spy(function (res) {
            stub.restore();
            expect(spy.calledWith(Boom.badImplementation('error'))).to.be.true();
            expect(spy.called).to.be.true();
            next();
        });
        var request = {
            params: {
                _id: 'test'
            },
            payload: sampleJson
        };
        result(request, spy);
    });
    test('Handler - second call error', function (next) {
        var sampleJson = {_id: 'test'};
        var route = {};
        var result = curdCoreHandler.handlerInit(route, options);
        expect(result).to.be.a.function();
        var stub = Sinon.stub(documentService, 'findByIdAndUpdate', function (id, payload, callback) {
            expect(payload).to.deep.equal(sampleJson);
            expect(id).to.be.equal('test');
            callback(null, sampleJson);
        });
        var i = 0;
        var stub1 = Sinon.stub(documentService, 'findById', function (id, projs, callback) {
            expect(id).to.be.equal('test');
            if (i === 0) {
                i++;
                callback(null, sampleJson);
            }
            else {
                i++;
                callback('error');
            }
        });
        var spy = Sinon.spy(function (res) {
            stub.restore();
            stub1.restore();
            expect(spy.calledWith(Boom.badImplementation('error'))).to.be.true();
            expect(spy.called).to.be.true();
            next();
        });
        var request = {
            params: {
                _id: 'test'
            },
            payload: sampleJson
        };
        result(request, spy);
    });
    after(function (next) {
        stub.restore();
        next();
    });
});
