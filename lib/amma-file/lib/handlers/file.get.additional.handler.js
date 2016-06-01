"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CoreFileHandler = require('./file.core.handler');
var FileGetAdditionalHandler = (function (_super) {
    __extends(FileGetAdditionalHandler, _super);
    function FileGetAdditionalHandler() {
        var _this = this;
        _super.apply(this, arguments);
        this.handler = function (request, reply) {
            var additionalPath = request.params.additionalPath;
            var fileHelper = _this.getFileHelperInstance(request);
            var files = fileHelper.getExtFiles(additionalPath);
            reply({ files: files });
        };
    }
    return FileGetAdditionalHandler;
}(CoreFileHandler.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FileGetAdditionalHandler;
