import Hapi = require("hapi");
import Boom = require("boom");
import FileManager = require('../services/file.manager');
import CoreFileHandler = require('./file.core.handler');
import ObjectPath = require('object-path');
import Joi = require('joi');

class FileSaveHandler extends CoreFileHandler.default {

    protected name:string = 'fileSave';
    handler = (request:Hapi.IRequestHandler<Hapi.Request>, reply:Hapi.IReply) => {
        const fileHelper = this.getFileHelperInstance(request);
        fileHelper.syncSrcToTemp((err)=> {
            if (err) {
                reply(Boom.badImplementation(err));
            } else {
                reply({success: true});
            }
        });
    };

}
export default FileSaveHandler;