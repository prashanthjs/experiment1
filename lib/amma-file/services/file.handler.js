var Boom = require("boom");
var FileHandler = (function () {
    function FileHandler() {
        var _this = this;
        this.setServer = function (server) {
            _this.server = server;
        };
    }
    FileHandler.prototype.getFileHelperInstance = function (options, extPath, token) {
        return this.server.plugins['amma-file'].fileFactory.getInstance(options, extPath, token);
    };
    FileHandler.prototype.getFileManager = function () {
        return this.server.plugins['amma-file'].fileManager;
    };
    FileHandler.prototype.getOptions = function (type) {
        return this.server.settings.app.file[type];
    };
    FileHandler.prototype.createToken = function (request, reply) {
        var token = this.getFileManager().createToken();
        var type = request.params.type;
        var extPath = request.params.extPath;
        var fileHelper = this.getFileHelperInstance(this.getOptions(type), extPath, token);
        fileHelper.syncSrcToTemp(function (err) {
            if (err) {
                reply(Boom.badImplementation(err));
            }
            else {
                reply({ token: token });
            }
        });
    };
    FileHandler.prototype.getFiles = function (request, reply) {
        var type = request.params.type;
        var extPath = request.params.extPath;
        var fileHelper = this.getFileHelperInstance(this.getOptions(type), extPath);
        var files = fileHelper.getSrcFiles();
        reply({ files: files });
    };
    FileHandler.prototype.getTempFiles = function (request, reply) {
        var type = request.params.type;
        var extPath = request.params.extPath;
        var token = request.params.token;
        var fileHelper = this.getFileHelperInstance(this.getOptions(type), extPath, token);
        var files = fileHelper.getTempFiles();
        reply({ files: files });
    };
    FileHandler.prototype.getFilesWithAdditionalPath = function (request, reply) {
        var type = request.params.type;
        var extPath = request.params.extPath;
        var additionalPath = request.params.additionalPath;
        var fileHelper = this.getFileHelperInstance(this.getOptions(type), extPath);
        var files = fileHelper.getExtFiles(additionalPath);
        reply({ files: files });
    };
    FileHandler.prototype.upload = function (request, reply) {
        var type = request.params.type;
        var extPath = request.params.extPath;
        var token = request.params.token;
        var fileHelper = this.getFileHelperInstance(this.getOptions(type), extPath, token);
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
    FileHandler.prototype.save = function (request, reply) {
        var type = request.params.type;
        var extPath = request.params.extPath;
        var token = request.params.token;
        var fileHelper = this.getFileHelperInstance(this.getOptions(type), extPath, token);
        fileHelper.syncSrcToTemp(function (err) {
            if (err) {
                reply(Boom.badImplementation(err));
            }
            else {
                reply({ success: true });
            }
        });
    };
    FileHandler.prototype.removeFile = function (request, reply) {
        var type = request.params.type;
        var extPath = request.params.extPath;
        var token = request.params.token;
        var fileName = request.params.fileName;
        var fileHelper = this.getFileHelperInstance(this.getOptions(type), extPath, token);
        fileHelper.removeFile(fileName);
        reply({
            success: true
        });
    };
    return FileHandler;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FileHandler;
