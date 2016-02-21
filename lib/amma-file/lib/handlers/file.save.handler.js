var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }

        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
var Boom = require("boom");
var CoreFileHandler = require('./file.core.handler');
var FileSaveHandler = (function (_super) {
    __extends(FileSaveHandler, _super);
    function FileSaveHandler() {
        var _this = this;
        _super.apply(this, arguments);
        this.name = 'fileSave';
        this.handler = function (request, reply) {
            var fileHelper = _this.getFileHelperInstance(request);
            fileHelper.syncSrcToTemp(function (err) {
                if (err) {
                    reply(Boom.badImplementation(err));
                }
                else {
                    reply({success: true});
                }
            });
        };
    }

    return FileSaveHandler;
})(CoreFileHandler.default);
Object.defineProperty(exports, "__esModule", {value: true});
exports.default = FileSaveHandler;