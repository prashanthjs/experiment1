var DocumentService = require('./document.service');
var DocumentServiceFactory = (function () {
    function DocumentServiceFactory() {
    }

    DocumentServiceFactory.prototype.setServer = function (server) {
        this.server = server;
    };
    DocumentServiceFactory.prototype.getDbParser = function (schema) {
        return this.server.settings.app.services.dbParserFactory.getDbParser(schema);
    };
    DocumentServiceFactory.prototype.getDocumentService = function (collectionName, schema) {
        var documentService = new DocumentService.default();
        documentService.setServer(this.server);
        documentService.setCollectionName(collectionName);
        documentService.setSchema(schema);
        var dbParser = this.getDbParser(schema);
        documentService.setDbParser(dbParser);
        return documentService;
    };
    return DocumentServiceFactory;
})();
Object.defineProperty(exports, "__esModule", {value: true});
exports.default = DocumentServiceFactory;
