import Hapi = require("hapi");
import Boom = require("boom");
import Async = require('async');
import FileManager = require('./file.manager');
import FileHelper = require('./file.helper');

export interface ICreateTokenRequest extends Hapi.IRequestHandler<Hapi.Request> {
    params: {
        extPath?: string;
        type:string;
    };
}

export interface IFilesRequest extends Hapi.IRequestHandler<Hapi.Request> {
    params: {
        extPath: string;
        type:string;
    };
}
export interface IFilesRequestWithToken extends Hapi.IRequestHandler<Hapi.Request> {
    params: {
        extPath: string;
        type:string;
        token: string;
    };
}
export interface IFilesRequestWithAdditionalPath extends Hapi.IRequestHandler<Hapi.Request> {
    params: {
        extPath: string;
        type:string;
        additionalPath: string;
    };
}

export interface IFileUpload extends IFilesRequestWithToken {
    payload:any
}

export interface IFileDelete extends Hapi.IRequestHandler<Hapi.Request> {
    params: {
        extPath: string;
        type:string;
        token: string;
        fileName: string;
    };
}


class FileHandler {

    protected server:Hapi.Server;

    setServer = (server:Hapi.Server) => {
        this.server = server;
    };

    protected getFileHelperInstance(options:FileHelper.IOptions, extPath:string, token?:string):FileHelper.IFileHelper {
        return this.server.plugins['amma-file'].fileFactory.getInstance(options, extPath, token);
    }

    protected getFileManager():FileManager.IFileManager {
        return this.server.plugins['amma-file'].fileManager;
    }

    protected getOptions(type:string):FileHelper.IOptions {
        return this.server.settings.app.file[type];
    }

    createToken(request:ICreateTokenRequest, reply:Hapi.IReply):void {
        const token = this.getFileManager().createToken();
        const type = request.params.type;
        const extPath = request.params.extPath;
        const fileHelper = this.getFileHelperInstance(this.getOptions(type), extPath, token);
        fileHelper.syncSrcToTemp((err)=> {
            if (err) {
                reply(Boom.badImplementation(err));
            } else {
                reply({token: token});
            }
        });
    }

    getFiles(request:IFilesRequest, reply:Hapi.IReply):void {
        const type = request.params.type;
        const extPath = request.params.extPath;
        const fileHelper = this.getFileHelperInstance(this.getOptions(type), extPath);
        const files = fileHelper.getSrcFiles();
        reply({files: files});
    }

    getTempFiles(request:IFilesRequestWithToken, reply:Hapi.IReply):void {
        const type = request.params.type;
        const extPath = request.params.extPath;
        const token = request.params.token;
        const fileHelper = this.getFileHelperInstance(this.getOptions(type), extPath, token);
        const files = fileHelper.getTempFiles();
        reply({files: files});
    }

    getFilesWithAdditionalPath(request:IFilesRequestWithAdditionalPath, reply:Hapi.IReply) {
        const type = request.params.type;
        const extPath = request.params.extPath;
        const additionalPath = request.params.additionalPath;
        const fileHelper = this.getFileHelperInstance(this.getOptions(type), extPath);
        const files = fileHelper.getExtFiles(additionalPath);
        reply({files: files});
    }

    upload(request:IFileUpload, reply:Hapi.IReply):void {
        const type = request.params.type;
        const extPath = request.params.extPath;
        const token = request.params.token;
        const fileHelper = this.getFileHelperInstance(this.getOptions(type), extPath, token);
        fileHelper.upload(request.payload.file, request.payload.file.hapi.filename, function (error, result) {
            if (error) {
                reply(Boom.badData(error));
            } else {
                let ret = {
                    filename: result.filename,
                    headers: request.payload.file.hapi.headers
                };
                reply(ret);
            }
        });
    }

    save(request:IFilesRequestWithToken, reply:Hapi.IReply):any {
        const type = request.params.type;
        const extPath = request.params.extPath;
        const token = request.params.token;
        const fileHelper = this.getFileHelperInstance(this.getOptions(type), extPath, token);
        fileHelper.syncSrcToTemp((err)=> {
            if (err) {
                reply(Boom.badImplementation(err));
            } else {
                reply({success: true});
            }
        });
    }

    removeFile(request:IFileDelete, reply:Hapi.IReply):any {
        const type = request.params.type;
        const extPath = request.params.extPath;
        const token = request.params.token;
        let fileName = request.params.fileName;
        const fileHelper = this.getFileHelperInstance(this.getOptions(type), extPath, token);
        fileHelper.removeFile(fileName);
        reply({
            success: true
        });
    }
}

export default FileHandler;