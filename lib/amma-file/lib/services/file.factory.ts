import FileManager = require('./file.manager');
import FileHelper = require('./file.helper');
import Hapi = require('hapi');

export interface IFileFactory {
    getFileManager():FileManager.IFileManager;
    getInstance(options:FileHelper.IOptions, extPath:string, token:string):FileHelper.IFileHelper;
}

class FileFactory implements IFileFactory {

    protected server:Hapi.Server;

    setServer = (server:Hapi.Server) => {
        this.server = server;
    };

    getFileManager():FileManager.IFileManager {
        return this.server.plugins['amma-file'].fileManager;
    }


    getInstance(options:FileHelper.IOptions, extPath:string, token:string):FileHelper.IFileHelper {
        return new FileHelper.default(this.getFileManager(), options, extPath, token);
    }

}
export default FileFactory;