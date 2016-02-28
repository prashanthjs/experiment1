var Mongoose = require('mongoose');
var DocumentService = (function () {
    function DocumentService() {
    }

    DocumentService.prototype.getModel = function () {
        if (!this.model) {
            var names = Mongoose.modelNames();
            if (names.indexOf(this.collectionName) == -1) {
                this.model = Mongoose.model(this.collectionName, this.schema);
            }
            else {
                this.model = Mongoose.model(this.collectionName);
            }
        }
        return this.model;
    };
    DocumentService.prototype.findAll = function (options, projections, next) {
        this.dbParser.parse(options);
        var model = this.getModel();
        model.find(this.dbParser.filter, projections).sort(this.dbParser.sort).limit(this.dbParser.pageSize).skip(this.dbParser.skip).exec(next);
    };
    DocumentService.prototype.findAllCount = function (options, next) {
        this.dbParser.parse(options);
        this.getModel().count(this.dbParser.filter).exec(next);
    };
    DocumentService.prototype.findById = function (id, projections, next) {
        this.getModel().findById(id, projections).exec(next);
    };
    DocumentService.prototype.findOne = function (options, projections, next) {
        this.dbParser.parse(options);
        this.getModel().findOne(this.dbParser.filter, projections).exec(next);
    };
    DocumentService.prototype.create = function (payload, next) {
        this.getModel().create(payload, next);
    };
    DocumentService.prototype.findByIdAndUpdate = function (id, payload, next) {
        this.getModel().findByIdAndUpdate(id, payload, {upsert: true}, next);
    };
    DocumentService.prototype.findByIdAndRemove = function (id, next) {
        this.getModel().findByIdAndRemove(id, next);
    };
    DocumentService.prototype.setServer = function (server) {
        this.server = server;
    };
    DocumentService.prototype.setCollectionName = function (collectionName) {
        this.collectionName = collectionName;
    };
    DocumentService.prototype.setSchema = function (schema) {
        this.schema = schema;
    };
    DocumentService.prototype.setDbParser = function (dbParser) {
        this.dbParser = dbParser;
    };
    return DocumentService;
})();
Object.defineProperty(exports, "__esModule", {value: true});
exports.default = DocumentService;
