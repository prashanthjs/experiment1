"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CoreFileHandler = require('./file.core.handler');
var FileGetTempHandler = (function (_super) {
    __extends(FileGetTempHandler, _super);
    function FileGetTempHandler() {
        var _this = this;
        _super.apply(this, arguments);
        this.handler = function (request, reply) {
            var fileHelper = _this.getFileHelperInstance(request);
            var files = fileHelper.getTempFiles();
            reply({ files: files });
        };
    }
    return FileGetTempHandler;
}(CoreFileHandler.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FileGetTempHandler;
