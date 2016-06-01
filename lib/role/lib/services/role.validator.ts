import Hapi = require('hapi');
import Boom = require('boom');
import Joi = require('joi');
import Bcrypt = require('bcrypt');
import {IRoleDbService} from "./role.db.service";


export interface ICallback {
    (err?:any, results?:any): any;
}

export interface IRoleValidator {
    roleValidator(id, next:ICallback):void;
}

class RoleValidator implements IRoleValidator {

    private server:Hapi.Server;

    roleValidator = (id, next:ICallback) => {
        if (!id) {
            return next();
        }

        Joi.assert(id, Joi.alternatives().try(Joi.string(), Joi.array().items(Joi.string())), 'Invalid data provided to hapi method');
        let ids = [];
        if (!Array.isArray(id)) {
            ids.push(id);
        } else {
            ids = id;
        }
        this.getDbService().getModel().find({
            _id: {
                $in: ids
            }
        }, (err, docs) => {
            if (err) {
                next(Boom.badImplementation(err));
            }
            else if (!docs) {
                next(Boom.forbidden('Invalid role id(s) provided'));
            } else {
                if (docs.length === ids.length) {
                    next();
                } else {
                    next(Boom.forbidden('Invalid role id(s) provided'));
                }
            }
        });
    };

    privilegeValidator = (id, next:ICallback) => {
        if (!id) {
            return next();
        }
        Joi.assert(id, Joi.alternatives().try(Joi.string(), Joi.array().items(Joi.string())), 'Invalid data provided to hapi method');
        let ids = [];
        if (!Array.isArray(id)) {
            ids.push(id);
        } else {
            ids = id;
        }
        const privileges = this.getDbService().getAllPrivileges();
        let count = 0;
        for (let i = 0; i < ids.length; i++) {
            if (privileges.indexOf(ids[i]) != -1) {
                count ++;
            }
        }

        console.log(count);
        console.log('....')
        console.log(ids.length);
        if(count == ids.length){
           console.log('prashanth');
            next();
        }
        else {
            next(Boom.forbidden('Invalid privilege(s) provided'));
        }
    };

    setServer(server:Hapi.Server):void {
        this.server = server;
    }

    getDbService():IRoleDbService {
        return this.server.settings.app.services.roleDbService;
    }

}

export default RoleValidator;
