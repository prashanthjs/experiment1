import Hapi = require("hapi");
import Boom = require("boom");
import Async = require('async');
import Fs = require('fs-plus');
import Gm = require('gm');
import Uuid = require('node-uuid');
import Path = require('path');
import NodeFs = require('fs');

export interface IThumbnail {
    name: string;
    width: number;
    height: number;
    quality: number;
}

export interface ICallback {
    (err?:any, results?:any): any;
}

export interface IFileManager {
    createToken():string;
    syncFiles(srcDir:string, targetDir:string):void;
    getTopLevelFiles(path:string, extensions?:string[]):string[];
    getOnlyFiles(path:string, extensions?:string[]):string[];
    removeSyncSubDir(path:string):void;
    getUniqueFileName(file:string):string;
    removeFile(path:string):void;
    createThumbnail(file:string, targetPath:string, thumbnail:IThumbnail, next:ICallback):void;
    createThumbnails(path:string, thumbnails:IThumbnail[], callback:ICallback):void;
    isImage(path:string):boolean;
    upload(file:NodeFs.ReadStream, fileName:string, pathToUpload:string, callback:ICallback):void;
}


class FileManager implements IFileManager {

    /**
     *
     * @returns {string}
     */
    createToken():string {
        return Uuid.v1();
    }

    syncFiles(srcDir:string, targetDir:string):void {
        this.removeFile(targetDir);
        Fs.makeTreeSync(targetDir);
        if (Fs.isDirectorySync(srcDir)) {
            Fs.copySync(srcDir, targetDir);
        }
    }

    getTopLevelFiles(path:string, extensions?:string[]):string[] {
        if (Fs.isDirectorySync(path)) {
            return Fs.listSync(path, extensions)
        } else {
            return [];
        }
    }

    getOnlyFiles(path:string, extensions?:string[]):string[] {
        const files = this.getTopLevelFiles(path, extensions);
        let temp = [];
        for (let i = 0; i < files.length; i++) {
            if (Fs.isFileSync(files[i])) {
                temp.push(Path.parse(files[i]).base);
            }
        }
        return temp;
    }

    /**
     *
     * @param path
     */
    removeSyncSubDir(path:string):void {
        const files = this.getTopLevelFiles(path);
        for (let i = 0; i < files.length; i++) {
            if (Fs.isDirectorySync(files[i])) {
                this.removeFile(files[i]);
            }
        }
    }

    /**
     *
     * @param file
     * @returns {string}
     */
    getUniqueFileName(file:string):string {
        let parseData = Path.parse(file);
        let dir = parseData.dir;
        let fileName = parseData.name;
        let ext = parseData.ext;
        let i = 1;
        fileName = fileName.replace(/[^a-zA-Z0-9_-]/g, '');
        file = Path.join(dir, fileName + ext);
        while (Fs.isFileSync(file)) {
            file = Path.join(dir, fileName + '_' + i + ext);
            i = i + 1;
        }
        return file;
    }

    /**
     *
     * @param path
     */
    removeFile(path:string):void {
        Fs.removeSync(path);
    }


    createThumbnail(file:string, targetPath:string, thumbnail:IThumbnail, next:ICallback) {
        if (this.isImage(file)) {
            const name = thumbnail.name;
            const width = thumbnail.width;
            const height = thumbnail.height;
            const quality = thumbnail.quality;
            const destination = Path.join(targetPath, name);
            const filename = Path.parse(file).base;
            const thumbnailPath = Path.join(destination, filename);
            Fs.makeTreeSync(destination);
            Gm(file).thumb(width, height, thumbnailPath, quality, next);
        } else {
            next();
        }
    }

    createThumbnails(path:string, thumbnails:IThumbnail[], callback:ICallback) {
        const files = this.getOnlyFiles(path);
        if (files.length) {
            Async.eachSeries(files,
                (f:string, _callback:ICallback) => {
                    let file = Path.join(path, f);
                    Async.eachSeries(
                        thumbnails,
                        (thumbnail:IThumbnail, __callback:ICallback) => {
                            this.createThumbnail(file, path, thumbnail, __callback);
                        },
                        (err:any) => {
                            _callback(err);
                        });

                },
                (err:any) => {
                    callback(err);
                });
        } else {
            callback();
        }

    }


    isImage(path:string):boolean {
        const parts = Path.parse(path);
        const ext = parts.ext;
        return Fs.isImageExtension(ext);
    }

    upload(file:NodeFs.ReadStream, fileName:string, pathToUpload:string, callback:ICallback):void {
        const path = this.getUniqueFileName(Path.join(pathToUpload, fileName));
        const fileStream = Fs.createWriteStream(path);
        fileStream.on('error', (err) => {
            callback(err);
        });
        file.pipe(fileStream);
        file.on('end', (err) => {
            const ret = {
                filename: Path.parse(path).base
            };
            callback(err, ret);
        });
    }

}

export default FileManager;