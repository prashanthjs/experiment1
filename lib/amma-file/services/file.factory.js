var FileHelper = require('./file.helper');
var FileFactory = (function () {
    function FileFactory() {
        var _this = this;
        this.setServer = function (server) {
            _this.server = server;
        };
    }
    FileFactory.prototype.getFileManager = function () {
        return this.server.plugins['amma-file'].fileManager;
    };
    FileFactory.prototype.getInstance = function (options, extPath, token) {
        return new FileHelper.default(this.getFileManager(), options, extPath, token);
    };
    return FileFactory;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FileFactory;
