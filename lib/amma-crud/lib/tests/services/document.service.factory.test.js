var Hapi = require('hapi');
var Code = require('code');
var Lab = require('lab');
var Mongoose = require('mongoose');
var ObjectPath = require('object-path');
var DocumentService = require('../../services/document.service');
var DbParserFactory = require('../../../../amma-db-parser/lib/services/db.parser.factory');
var DocumentServiceFactory = require('../../services/document.service.factory');
var lab = exports.lab = Lab.script(), before = lab.before, expect = Code.expect, suite = lab.suite, test = lab.test;
suite('Document Service Factory', function () {
    var server = new Hapi.Server();
    var dbParserFactory = new DbParserFactory.default();
    var documentServiceFactory = new DocumentServiceFactory.default();
    var schema = new Mongoose.Schema({});
    var collectionName = 'string';
    before(function (next) {
        ObjectPath.ensureExists(server, 'settings.app.services', {});
        server.settings.app.services.dbParserFactory = dbParserFactory;
        documentServiceFactory.setServer(server);
        next();
    });
    test('Instance of Document Service', function (next) {
        var documentService = documentServiceFactory.getDocumentService(collectionName, schema);
        expect(documentService).to.be.an.instanceOf(DocumentService.default);
        next();
    });
});
