var Async = require('async');
var Fs = require('fs-plus');
var Gm = require('gm');
var Uuid = require('node-uuid');
var Path = require('path');
var FileManager = (function () {
    function FileManager() {
    }
    /**
     *
     * @returns {string}
     */
    FileManager.prototype.createToken = function () {
        return Uuid.v1();
    };
    FileManager.prototype.syncFiles = function (srcDir, targetDir) {
        this.removeFile(targetDir);
        Fs.makeTreeSync(targetDir);
        Fs.copySync(srcDir, targetDir);
    };
    FileManager.prototype.getTopLevelFiles = function (path, extensions) {
        return Fs.listSync(path, extensions);
    };
    FileManager.prototype.getOnlyFiles = function (path, extensions) {
        var files = this.getTopLevelFiles(path, extensions);
        var temp = [];
        for (var i = 0; i < files.length; i++) {
            if (Fs.isFileSync(files[i])) {
                temp.push(files[i]);
            }
        }
        return temp;
    };
    /**
     *
     * @param path
     */
    FileManager.prototype.removeSyncSubDir = function (path) {
        var files = this.getTopLevelFiles(path);
        for (var i = 0; i < files.length; i++) {
            if (Fs.isDirectorySync(files[i])) {
                this.removeFile(files[i]);
            }
        }
    };
    /**
     *
     * @param file
     * @returns {string}
     */
    FileManager.prototype.getUniqueFileName = function (file) {
        var parseData = Path.parse(file);
        var dir = parseData.dir;
        var fileName = parseData.name;
        var ext = parseData.ext;
        var i = 1;
        while (Fs.isFileSync(file)) {
            file = Path.join(dir, fileName + '_' + i + ext);
            i = i + 1;
        }
        return file;
    };
    /**
     *
     * @param path
     */
    FileManager.prototype.removeFile = function (path) {
        Fs.removeSync(path);
    };
    FileManager.prototype.createThumbnail = function (file, targetPath, thumbnail, next) {
        if (this.isImage(file)) {
            var name_1 = thumbnail.name;
            var width = thumbnail.width;
            var height = thumbnail.height;
            var quality = thumbnail.quality;
            var destination = Path.join(targetPath, name_1);
            var filename = Path.parse(file).base;
            var thumbnailPath = Path.join(destination, filename);
            Fs.makeTreeSync(destination);
            Gm(file).thumb(width, height, thumbnailPath, quality, next);
        }
        else {
            next();
        }
    };
    FileManager.prototype.createThumbnails = function (path, thumbnails, callback) {
        var _this = this;
        var files = this.getOnlyFiles(path);
        if (files.length) {
            Async.eachSeries(files, function (f, _callback) {
                var file = Path.join(path, f);
                Async.eachSeries(thumbnails, function (thumbnail, __callback) {
                    _this.createThumbnail(file, path, thumbnail, __callback);
                }, function (err) {
                    _callback(err);
                });
            }, function (err) {
                callback(err);
            });
        }
        else {
            callback();
        }
    };
    FileManager.prototype.isImage = function (path) {
        return Fs.isImageExtension(path);
    };
    FileManager.prototype.upload = function (file, fileName, pathToUpload, callback) {
        var path = this.getUniqueFileName(Path.join(pathToUpload, fileName));
        var fileStream = Fs.createWriteStream(path);
        fileStream.on('error', function (err) {
            callback(err);
        });
        file.pipe(fileStream);
        file.on('end', function (err) {
            var ret = {
                filename: Path.parse(path).base
            };
            callback(err, ret);
        });
    };
    return FileManager;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FileManager;
