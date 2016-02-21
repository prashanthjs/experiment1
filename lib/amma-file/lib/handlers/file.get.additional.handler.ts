import Hapi = require("hapi");
import Boom = require("boom");
import FileManager = require('../services/file.manager');
import CoreFileHandler = require('./file.core.handler');
import ObjectPath = require('object-path');
import Joi = require('joi');

export interface IFilesRequestWithAdditionalPath extends Hapi.IRequestHandler<Hapi.Request> {
    params: {
        additionalPath: string;
    };
}

class FileGetAdditionalHandler extends CoreFileHandler.default {

    protected name:string = 'fileGetAdditional';

    handler = (request:IFilesRequestWithAdditionalPath, reply:Hapi.IReply) => {
        const additionalPath = request.params.additionalPath;
        const fileHelper = this.getFileHelperInstance(request);
        const files = fileHelper.getExtFiles(additionalPath);
        reply({files: files});
    };

}
export default FileGetAdditionalHandler;