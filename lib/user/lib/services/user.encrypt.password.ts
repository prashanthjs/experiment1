import Hapi = require('hapi');
import Boom = require('boom');
import Joi = require('joi');
import Bcrypt = require('bcrypt');
import IUserDbService from "./user.db.service";

export interface ICallback {
    (err?:any, results?:any): any;
}

export interface IRequest extends Hapi.IRequestHandler<Hapi.Request> {
    payload:{
        password: string;
    };
}


export interface IUserEncryptPassword {
    encryptPasswordRequest(request, reply):void;
}

class UserEncryptPassword implements IUserEncryptPassword {
    private server:Hapi.Server;

    encryptPasswordRequest = (request:IRequest, reply:Hapi.IReply) => {
        this.getUserDbService().encryptPassword(request.payload.password, (err, hash:string) => {
            if (err) {
                reply(Boom.badImplementation(err));
            } else {
                request.payload.password = hash;
                reply({});
            }
        });
    };

    private getUserDbService():IUserDbService {
        return this.server.settings.app.services.userDbService;
    }

    setServer(server:Hapi.Server):void {
        this.server = server;
    }


}

export default UserEncryptPassword;
