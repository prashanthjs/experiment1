import Hapi = require("hapi");
import Boom = require("boom");
import FileManager = require('../services/file.manager');
import CoreFileHandler = require('./file.core.handler');
import ObjectPath = require('object-path');
import Joi = require('joi');

class FileTokenHandler extends CoreFileHandler.default {

    protected getFileManager = ():FileManager.IFileManager => {
        return this.server.settings.app.services.fileManager;
    };

    protected setToken = (request:Hapi.IRequestHandler<Hapi.Request>, token:string) => {
        if (ObjectPath.has(this.options, 'tokenPath')) {
            const tokenPath:any = ObjectPath.get(this.options, 'tokenPath');
            ObjectPath.set(request, tokenPath, token);
        }
    };

    handler = (request:Hapi.IRequestHandler<Hapi.Request>, reply:Hapi.IReply) => {
        const token = this.getFileManager().createToken();
        this.setToken(request, token);
        const fileHelper = this.getFileHelperInstance(request);
        fileHelper.syncSrcToTemp((err)=> {
            if (err) {
                reply(Boom.badImplementation(err));
            } else {
                reply({token: token});
            }
        });
    };

}

export default FileTokenHandler;