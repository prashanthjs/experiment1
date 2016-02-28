var Hapi = require('hapi');
var Code = require('code');
var Lab = require('lab');
var Sinon = require('sinon');
var ObjectPath = require('object-path');
var CurdCoreHandler = require('../../handlers/crud.core.handler');
var DocumentServiceFactory = require('../../services/document.service.factory');
var DocumentService = require('../../services/document.service');
var lab = exports.lab = Lab.script(), before = lab.before, after = lab.after, expect = Code.expect, suite = lab.suite, test = lab.test;
suite('Crud Core Handler', function () {
    var server = new Hapi.Server();
    var curdCoreHandler = new CurdCoreHandler.default();
    var documentServiceFactory = new DocumentServiceFactory.default();
    var documentService = new DocumentService.default();
    var options = {
        collectionName: 'test',
        schema: {}
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
    test('Handler Init and calling the function ', function (next) {
        var route = {};
        var result = curdCoreHandler.handlerInit(route, options);
        expect(result).to.be.a.function();
        var spy = Sinon.spy(function () {
            expect(spy.called).to.be.true();
            next();
        });
        var request = {};
        result(request, spy);
    });
    test('Get model', function (next) {
        var route = {};
        var result = curdCoreHandler.handlerInit(route, options);
        expect(result).to.be.a.function();
        var model = curdCoreHandler.getModel();
        expect(model).to.be.an.instanceOf(DocumentService.default);
        model = curdCoreHandler.getModel();
        expect(model).to.be.an.instanceOf(DocumentService.default);
        next();
    });
    after(function (next) {
        stub.restore();
        next();
    });
});
