var FileManager = require('./file.manager');
var Path = require('path');
var Fs = require('fs-plus');
var Joi = require('joi');
var Schema = require('../schema/schema');
var FileHelper = (function () {
    function FileHelper(fileManager, options, extPath, token) {
        this.fileManager = Joi.attempt(fileManager, Joi.object().type(FileManager.default), 'Invalid File manager passed to File Helper');
        this.options = Joi.attempt(options, Schema.default.FileSchema, 'Invalid Options passed to File Helper');
        this.extPath = extPath;
        this.token = token;
    }
    FileHelper.prototype.getSrcDir = function () {
        return Path.join(this.options.srcDir, this.extPath);
    };
    FileHelper.prototype.getTempDir = function () {
        return Path.join(this.options.tempDir, this.token);
    };
    FileHelper.prototype.getTempFiles = function () {
        return this.fileManager.getOnlyFiles(this.getTempDir());
    };
    FileHelper.prototype.getSrcFiles = function () {
        return this.fileManager.getOnlyFiles(this.getSrcDir());
    };
    FileHelper.prototype.getExtFiles = function (path) {
        return this.fileManager.getOnlyFiles(Path.join(this.getSrcDir(), path));
    };
    FileHelper.prototype.syncSrcToTemp = function (next) {
        if (this.extPath) {
            this.fileManager.syncFiles(this.getSrcDir(), this.getTempDir());
            this.fileManager.removeSyncSubDir(this.getTempDir());
        }
        else {
            Fs.makeTreeSync(this.getTempDir());
        }
        next();
    };
    FileHelper.prototype.syncTempToSrc = function (next) {
        this.fileManager.syncFiles(this.getTempDir(), this.getSrcDir());
        this.fileManager.removeSyncSubDir(this.getSrcDir());
        this.fileManager.createThumbnails(this.getSrcDir(), this.options.thumbnails, next);
    };
    FileHelper.prototype.hasValidExtension = function (file) {
        var parts = Path.parse(file);
        var ext = parts.ext;
        var options = this.options;
        if (Array.isArray(options.validExtensions)) {
            return options.validExtensions.indexOf(ext) != -1;
        }
        return true;
    };
    FileHelper.prototype.hasValidUploadLimit = function () {
        var files = this.getTempFiles();
        return (files.length < this.options.maxUpload);
    };
    FileHelper.prototype.canUpload = function (file) {
        return this.hasValidExtension(file) && this.hasValidUploadLimit();
    };
    FileHelper.prototype.hasValidUploadSaveRange = function () {
        var files = this.fileManager.getOnlyFiles(this.getTempDir());
        return (files.length <= this.options.maxUpload) && (files.length >= this.options.minUpload);
    };
    FileHelper.prototype.hasValidFiles = function () {
        var files = this.fileManager.getOnlyFiles(this.getTempDir());
        for (var i = 0; i < files.length; i++) {
            if (!this.hasValidExtension(files[i])) {
                return false;
            }
        }
        return true;
    };
    FileHelper.prototype.canSave = function () {
        return this.hasValidUploadSaveRange() && this.hasValidFiles();
    };
    FileHelper.prototype.upload = function (file, fileName, callback) {
        var tempDir = this.getTempDir();
        if (!this.hasValidExtension(fileName)) {
            callback('Invalid file');
        }
        else if (!this.hasValidUploadLimit()) {
            callback('Upload limit exceeded');
        }
        else {
            this.fileManager.upload(file, fileName, tempDir, callback);
        }
    };
    FileHelper.prototype.removeFile = function (file) {
        file = Path.join(this.getTempDir(), file);
        if (Fs.isFileSync(file)) {
            this.fileManager.removeFile(file);
        }
    };
    return FileHelper;
})();
exports.FileHelper = FileHelper;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FileHelper;
