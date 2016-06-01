"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Boom = require("boom");
var CoreFileHandler = require('./file.core.handler');
var ObjectPath = require('object-path');
var FileTokenHandler = (function (_super) {
    __extends(FileTokenHandler, _super);
    function FileTokenHandler() {
        var _this = this;
        _super.apply(this, arguments);
        this.getFileManager = function () {
            return _this.server.settings.app.services.fileManager;
        };
        this.setToken = function (request, token) {
            if (ObjectPath.has(_this.options, 'tokenPath')) {
                var tokenPath = ObjectPath.get(_this.options, 'tokenPath');
                ObjectPath.set(request, tokenPath, token);
            }
        };
        this.handler = function (request, reply) {
            var token = _this.getFileManager().createToken();
            _this.setToken(request, token);
            var fileHelper = _this.getFileHelperInstance(request);
            fileHelper.syncSrcToTemp(function (err) {
                if (err) {
                    reply(Boom.badImplementation(err));
                }
                else {
                    reply({ token: token });
                }
            });
        };
    }
    return FileTokenHandler;
}(CoreFileHandler.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FileTokenHandler;
