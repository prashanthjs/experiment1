import FileManager = require('./file.manager');
import Path = require('path');
import Async = require('async');
import Fs = require('fs-plus');
import Hapi = require('hapi');
import NodeFs = require('fs');
import Joi = require('joi');

import Schema = require('../schema/schema');

export interface IOptions {
    tempDir: string;
    srcDir: string;
    thumbnails?: FileManager.IThumbnail[];
    validExtensions?: string[];
    maxUpload: number;
    minUpload: number;
}

export interface ICallback {
    (err?:any, results?:any): any;
}

export interface IFileHelper {
    getSrcDir():string;
    getTempDir():string;
    syncSrcToTemp(next:ICallback):void;
    syncTempToSrc(next:ICallback):void;
    hasValidExtension(file:string):boolean;
    hasValidUploadLimit():boolean;
    canUpload(file):boolean;
    hasValidUploadSaveRange():boolean;
    hasValidFiles():boolean;
    canSave():boolean;
    getTempFiles():string[];
    getSrcFiles():string[];
    getExtFiles(path:string):string[];
    upload(file:NodeFs.ReadStream, fileName:string, callback:ICallback):void;
    removeFile(file:string):void;
}

export class FileHelper implements IFileHelper {

    protected fileManager:FileManager.IFileManager;
    protected options:IOptions;
    protected extPath:string;
    protected token:string;


    constructor(fileManager:FileManager.IFileManager, options:IOptions, extPath:string, token:string) {

        this.fileManager = Joi.attempt(fileManager,
            Joi.object().type(FileManager.default),
            'Invalid File manager passed to File Helper');
        this.options = Joi.attempt(options,
            Schema.default.FileSchema,
            'Invalid Options passed to File Helper');
        this.extPath = extPath;
        this.token = token;
    }


    getSrcDir():string {
        return Path.join(this.options.srcDir, this.extPath);
    }

    getTempDir():string {
        return Path.join(this.options.tempDir, this.token);
    }

    getTempFiles():string[] {
        return this.fileManager.getOnlyFiles(this.getTempDir());
    }

    getSrcFiles():string[] {
        return this.fileManager.getOnlyFiles(this.getSrcDir());
    }

    getExtFiles(path:string):string[] {
        return this.fileManager.getOnlyFiles(Path.join(this.getSrcDir(), path));
    }

    syncSrcToTemp(next:ICallback) {
        if (this.extPath) {
            this.fileManager.syncFiles(this.getSrcDir(), this.getTempDir());
            this.fileManager.removeSyncSubDir(this.getTempDir());
        } else {
            Fs.makeTreeSync(this.getTempDir());
        }
        next();
    }

    syncTempToSrc(next:ICallback) {
        this.fileManager.syncFiles(this.getTempDir(), this.getSrcDir());
        this.fileManager.removeSyncSubDir(this.getSrcDir());
        this.fileManager.createThumbnails(this.getSrcDir(), this.options.thumbnails, next);
    }

    hasValidExtension(file:string):boolean {
        const parts = Path.parse(file);
        const ext = parts.ext;
        const options = this.options;
        if (Array.isArray(options.validExtensions)) {
            return options.validExtensions.indexOf(ext) != -1;
        }
        return true;
    }

    hasValidUploadLimit():boolean {
        const files = this.getTempFiles();
        return (files.length < this.options.maxUpload);
    }

    canUpload(file):boolean {
        return this.hasValidExtension(file) && this.hasValidUploadLimit();
    }

    hasValidUploadSaveRange():boolean {
        const files = this.fileManager.getOnlyFiles(this.getTempDir());
        return (files.length <= this.options.maxUpload) && (files.length >= this.options.minUpload);
    }

    hasValidFiles():boolean {
        const files = this.fileManager.getOnlyFiles(this.getTempDir());
        for (let i = 0; i < files.length; i++) {
            if (!this.hasValidExtension(files[i])) {
                return false;
            }
        }
        return true;
    }

    canSave():boolean {
        return this.hasValidUploadSaveRange() && this.hasValidFiles();
    }

    upload(file:NodeFs.ReadStream, fileName:string, callback:ICallback):void {
        let tempDir = this.getTempDir();
        if (!this.hasValidExtension(fileName)) {
            callback('Invalid file');
        }
        else if (!this.hasValidUploadLimit()) {
            callback('Upload limit exceeded');
        }
        else {
            this.fileManager.upload(file, fileName, tempDir, callback);
        }
    }

    removeFile(file:string):void {
        file = Path.join(this.getTempDir(), file);
        if (Fs.isFileSync(file)) {
            this.fileManager.removeFile(file);
        }
    }


}
export default FileHelper;