"use strict";
var Joi = require('joi');
var HandlerSchema = require('../schema/handler.schema');
var CrudCoreHandler = (function () {
    function CrudCoreHandler() {
        var _this = this;
        this.handlerInit = function (route, options) {
            _this.route = route;
            _this.options = Joi.attempt(options, _this.getSchema(), 'Invalid directory handler options (' + route.path + ')');
            var handler = _this.handler;
            return handler;
        };
        this.handler = function (request, reply) {
            reply({});
        };
        this.getSchema = function () {
            return HandlerSchema.default.CoreHandlerOption;
        };
    }
    CrudCoreHandler.prototype.getModel = function () {
        if (!this.model) {
            var documentServiceFactory = this.server.settings.app.services.documentServiceFactory;
            this.model = documentServiceFactory.getDocumentService(this.options.collectionName, this.options.schema);
        }
        return this.model;
    };
    CrudCoreHandler.prototype.setServer = function (server) {
        this.server = server;
    };
    return CrudCoreHandler;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CrudCoreHandler;
