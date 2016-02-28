import Hapi = require("hapi");
import Boom = require("boom");
import FileManager = require('../services/file.manager');
import CoreFileHandler = require('./file.core.handler');
import ObjectPath = require('object-path');
import Joi = require('joi');

export interface IFileDelete extends Hapi.IRequestHandler<Hapi.Request> {
    params: {
        fileName: string;
    };
}

class FileRemoveHandler extends CoreFileHandler.default {

    handler = (request:IFileDelete, reply:Hapi.IReply) => {
        const fileName = request.params.fileName;
        const fileHelper = this.getFileHelperInstance(request);
        fileHelper.removeFile(fileName);
        reply({
            success: true
        });
    };

}
export default FileRemoveHandler;