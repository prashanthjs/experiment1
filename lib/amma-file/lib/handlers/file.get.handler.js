var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }

        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
var CoreFileHandler = require('./file.core.handler');
var FileGetHandler = (function (_super) {
    __extends(FileGetHandler, _super);
    function FileGetHandler() {
        var _this = this;
        _super.apply(this, arguments);
        this.name = 'fileGet';
        this.handler = function (request, reply) {
            var fileHelper = _this.getFileHelperInstance(request);
            var files = fileHelper.getSrcFiles();
            reply({files: files});
        };
    }

    return FileGetHandler;
})(CoreFileHandler.default);
Object.defineProperty(exports, "__esModule", {value: true});
exports.default = FileGetHandler;
