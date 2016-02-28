import Hapi = require("hapi");
import Boom = require("boom");
import FileManager = require('../services/file.manager');
import CoreFileHandler = require('./file.core.handler');
import ObjectPath = require('object-path');
import Joi = require('joi');

class FileGetTempHandler extends CoreFileHandler.default {

    handler = (request:Hapi.IRequestHandler<Hapi.Request>, reply:Hapi.IReply) => {
        const fileHelper = this.getFileHelperInstance(request);
        const files = fileHelper.getTempFiles();
        reply({files: files});
    };

}
export default FileGetTempHandler;