var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }

        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
var Boom = require("boom");
var CoreFileHandler = require('./file.core.handler');
var FileUploadHandler = (function (_super) {
    __extends(FileUploadHandler, _super);
    function FileUploadHandler() {
        var _this = this;
        _super.apply(this, arguments);
        this.name = 'fileUpload';
        this.handler = function (request, reply) {
            var fileHelper = _this.getFileHelperInstance(request);
            fileHelper.upload(request.payload.file, request.payload.file.hapi.filename, function (error, result) {
                if (error) {
                    reply(Boom.badData(error));
                }
                else {
                    var ret = {
                        filename: result.filename,
                        headers: request.payload.file.hapi.headers
                    };
                    reply(ret);
                }
            });
        };
    }

    return FileUploadHandler;
})(CoreFileHandler.default);
Object.defineProperty(exports, "__esModule", {value: true});
exports.default = FileUploadHandler;
