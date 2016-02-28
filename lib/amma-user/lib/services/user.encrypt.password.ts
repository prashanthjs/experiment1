import Hapi = require('hapi');
import Boom = require('boom');
import Joi = require('joi');
import Bcrypt = require('bcrypt');

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
    encryptPassword(password, next:ICallback):void;

}

class UserEncryptPassword implements IUserEncryptPassword {

    encryptPasswordRequest = (request:IRequest, reply:Hapi.IReply) => {
        this.encryptPassword(request.payload.password, (err, hash:string) => {
            if (err) {
                reply(Boom.badImplementation(err));
            } else {
                request.payload.password = hash;
                reply({});
            }
        });
    };

    encryptPassword = (password, next:ICallback) => {
        Bcrypt.genSalt(10, (error, salt) => {
            Bcrypt.hash(password, salt, (err, hash) => {
                if (err) {
                    next(err);
                }
                else {
                    next(null, hash);
                }
            });
        });
    };

}

export default UserEncryptPassword;
