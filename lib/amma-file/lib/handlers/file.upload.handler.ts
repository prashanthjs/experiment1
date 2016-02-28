import Hapi = require("hapi");
import Boom = require("boom");
import FileManager = require('../services/file.manager');
import CoreFileHandler = require('./file.core.handler');
import ObjectPath = require('object-path');
import Joi = require('joi');

export interface IFileUpload extends Hapi.IRequestHandler<Hapi.Request> {
    payload:any
}

class FileUploadHandler extends CoreFileHandler.default {

    handler = (request:IFileUpload, reply:Hapi.IReply) => {
        const fileHelper = this.getFileHelperInstance(request);
        fileHelper.upload(request.payload.file, request.payload.file.hapi.filename, (error, result) => {
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
    };

}
export default FileUploadHandler;