import Hapi = require("hapi");
import Boom = require("boom");
import FileManager = require('../services/file.manager');
import CoreFileHandler = require('./file.core.handler');
import ObjectPath = require('object-path');
import Joi = require('joi');

class FileSaveHandler extends CoreFileHandler.default {

    handler = (request:Hapi.IRequestHandler<Hapi.Request>, reply:Hapi.IReply) => {
        const fileHelper = this.getFileHelperInstance(request);
        if (fileHelper.canSave()) {
            fileHelper.syncTempToSrc((err)=> {
                if (err) {
                    reply(Boom.badImplementation(err));
                } else {
                    reply({success: true});
                }
            });
        } else {
            if (!fileHelper.hasValidFiles()) {
                reply(Boom.badRequest('Invalid files'));
            } else {
                reply(Boom.badRequest('Invalid file range'));
            }

        }
    };

}
export default FileSaveHandler;