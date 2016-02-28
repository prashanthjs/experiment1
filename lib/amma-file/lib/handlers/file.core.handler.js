var ObjectPath = require('object-path');
var Schema = require('../schema/schema');
var Joi = require('joi');
var FileCoreHandler = (function () {
    function FileCoreHandler() {
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
        this.getExtpath = function (request) {
            if (ObjectPath.has(_this.options, 'extPath')
                && ObjectPath.has(request, _this.options.extPath)) {
                return ObjectPath.get(request, _this.options.extPath);
            }
            return null;
        };
        this.getToken = function (request) {
            if (ObjectPath.has(_this.options, 'tokenPath')
                && ObjectPath.has(request, _this.options.tokenPath)) {
                return ObjectPath.get(request, _this.options.tokenPath);
            }
            return null;
        };
        this.getSchema = function () {
            return Schema.default.FileHandlerSchema;
        };
        this.getFileHelperInstance = function (request) {
            return _this.server.settings.app.services.fileFactory.getInstance(_this.options.fileOptions, _this.getExtpath(request), _this.getToken(request));
        };
    }
    FileCoreHandler.prototype.setServer = function (server) {
        this.server = server;
    };
    return FileCoreHandler;
})();
Object.defineProperty(exports, "__esModule", {value: true});
exports.default = FileCoreHandler;
