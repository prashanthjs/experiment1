import Hapi = require('hapi');
import Code = require('code');
import Lab = require('lab');
import Sinon = require('sinon');
import Mongoose = require('mongoose');
import ObjectPath = require('object-path');
import DocumentService = require('../../services/document.service');
import DbParserFactory = require('../../../../amma-db-parser/lib/services/db.parser.factory');
import DocumentServiceFactory = require('../../services/document.service.factory');

const lab = exports.lab = Lab.script(),
    before = lab.before,
    expect = Code.expect,
    suite = lab.suite,
    test = lab.test;

suite('Document Service Factory', () => {
    const server = new Hapi.Server();
    const dbParserFactory = new DbParserFactory.default();
    const documentServiceFactory = new DocumentServiceFactory.default();
    const schema = new Mongoose.Schema({});
    const collectionName = 'string';
    before((next)=> {
        ObjectPath.ensureExists(server, 'settings.app.services', {});
        server.settings.app.services.dbParserFactory = dbParserFactory;
        documentServiceFactory.setServer(server);
        next();
    });

    test('Instance of Document Service', (next) => {
        const documentService = documentServiceFactory.getDocumentService(collectionName, schema);
        expect(documentService).to.be.an.instanceOf(DocumentService.default);
        next();
    });
});