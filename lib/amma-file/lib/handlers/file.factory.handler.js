"use strict";
var FileGetHandler = require('./file.get.handler');
var FileGetAdditionalHandler = require('./file.get.additional.handler');
var FileGetTempHandler = require('./file.get.temp.handler');
var FileRemoveHandler = require('./file.remove.handler');
var FileSaveHandler = require('./file.save.handler');
var FileTokenHandler = require('./file.token.handler');
var FileUploadHandler = require('./file.upload.handler');
var FileFactoryHandler = (function () {
    function FileFactoryHandler() {
        var _this = this;
        this.handlerFileGet = function (route, options) {
            var cls = new FileGetHandler.default();
            cls.setServer(_this.server);
            return cls.handlerInit(route, options);
        };
        this.handlerFileGetAdditional = function (route, options) {
            var cls = new FileGetAdditionalHandler.default();
            cls.setServer(_this.server);
            return cls.handlerInit(route, options);
        };
        this.handlerFileGetTemp = function (route, options) {
            var cls = new FileGetTempHandler.default();
            cls.setServer(_this.server);
            return cls.handlerInit(route, options);
        };
        this.handlerFileRemove = function (route, options) {
            var cls = new FileRemoveHandler.default();
            cls.setServer(_this.server);
            return cls.handlerInit(route, options);
        };
        this.handlerFileSave = function (route, options) {
            var cls = new FileSaveHandler.default();
            cls.setServer(_this.server);
            return cls.handlerInit(route, options);
        };
        this.handlerFileToken = function (route, options) {
            var cls = new FileTokenHandler.default();
            cls.setServer(_this.server);
            return cls.handlerInit(route, options);
        };
        this.handlerFileUpload = function (route, options) {
            var cls = new FileUploadHandler.default();
            cls.setServer(_this.server);
            return cls.handlerInit(route, options);
        };
    }
    FileFactoryHandler.prototype.setServer = function (server) {
        this.server = server;
    };
    return FileFactoryHandler;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FileFactoryHandler;
