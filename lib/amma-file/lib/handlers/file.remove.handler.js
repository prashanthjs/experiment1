"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CoreFileHandler = require('./file.core.handler');
var FileRemoveHandler = (function (_super) {
    __extends(FileRemoveHandler, _super);
    function FileRemoveHandler() {
        var _this = this;
        _super.apply(this, arguments);
        this.handler = function (request, reply) {
            var fileName = request.params.fileName;
            var fileHelper = _this.getFileHelperInstance(request);
            fileHelper.removeFile(fileName);
            reply({
                success: true
            });
        };
    }
    return FileRemoveHandler;
}(CoreFileHandler.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FileRemoveHandler;
