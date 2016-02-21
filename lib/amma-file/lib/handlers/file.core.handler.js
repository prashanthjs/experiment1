var ObjectPath = require('object-path');
var Schema = require('../schema/schema');
var Joi = require('joi');
var FileCoreHandler = (function () {
    function FileCoreHandler() {
        var _this = this;
        this.name = '';
        this.handlerInit = function (route, options) {
            _this.route = route;
            _this.options = Joi.attempt(options, _this.getSchema(), 'Invalid directory handler options (' + route.path + ')');
            var handler = _this.handler;
            return handler;
        };
        this.handler = function (request, reply) {
            reply({});
        };
    }

    FileCoreHandler.prototype.setServer = function (server) {
        this.server = server;
    };
    FileCoreHandler.prototype.init = function (next) {
        this.server.handler(this.name, this.handlerInit);
        next();
    };
    FileCoreHandler.prototype.getExtpath = function (request) {
        if (ObjectPath.has(this.options, 'extPath')
            && ObjectPath.has(request, this.options.extPath)) {
            return ObjectPath.get(request, this.options.extPath);
        }
        return null;
    };
    FileCoreHandler.prototype.getToken = function (request) {
        if (ObjectPath.has(this.options, 'tokenPath')
            && ObjectPath.has(request, this.options.tokenPath)) {
            return ObjectPath.get(request, this.options.tokenPath);
        }
        return null;
    };
    FileCoreHandler.prototype.getSchema = function () {
        return Schema.default.FileHandlerSchema;
    };
    FileCoreHandler.prototype.getFileHelperInstance = function (request) {
        return this.server.plugins['amma-file'].fileFactory.getInstance(this.options.fileOptions, this.getExtpath(request), this.getToken(request));
    };
    return FileCoreHandler;
})();
Object.defineProperty(exports, "__esModule", {value: true});
exports.default = FileCoreHandler;
