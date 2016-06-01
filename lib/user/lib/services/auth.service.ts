import Hapi = require("hapi");
import _ = require("lodash");
import ObjectPath = require('object-path');
import JWT = require('jsonwebtoken');
import UUID = require('node-uuid');
import Bcrypt = require('bcrypt');
import IUserDbService from "./user.db.service";
import IRoleDbService from "../../../role/lib/services/role.db.service";
let HapiAuthJwt = require('hapi-auth-jwt2');


export interface ICallback {
    (err?:any, results?:any): any;
}

export interface IUserToken {
    token: string
}

export interface IAuthService {
    init(next:any): void;
    createGuestToken(): string;
    createAndAddToken(id:string, next:ICallback): void;
    validate(decoded:IUserToken, request:Hapi.Request, callback:ICallback): void;
    onRequest(request:Hapi.Request, reply:Hapi.IReply): void;
    login(id:string, password:string, callback:ICallback): void;
    logout(token:string, callback:ICallback): void;
}

class AuthService implements IAuthService {
    private guestToken:string;
    private server:Hapi.Server;

    init = (next) => {
        this.server.ext('onRequest', this.onRequest);
        this.server.register(HapiAuthJwt, (err) => {
            this.guestToken = this.createGuestToken();
            if (err) {
                return next(err);
            }
            this.server.auth.strategy('jwt', 'jwt', false, {
                key: this.getSecret(),
                validateFunc: this.validate,
                verifyOptions: {ignoreExpiration: true}
            });
            this.server.auth.default('jwt');
            return next();
        });
    };

    onRequest = (request:Hapi.Request, reply:Hapi.IReply) => {
        let authToken = ObjectPath.get(request.headers, 'authorization', null);
        if (!authToken) {
            ObjectPath.set(request.headers, 'authorization', this.guestToken);
        }
        reply.continue();
    };

    createGuestToken():string {
        let token = 'guest';
        return JWT.sign({token: token}, this.getSecret());
    }

    createAndAddToken(id:string, next:ICallback) {
        let token = UUID.v1();
        let userModel = this.getUserDbService();
        userModel.findByIdAndUpdateToken(id, token, (err) => {
            if (err) {
                return next(err);
            }
            return next(null, {token: JWT.sign({token: token}, this.getSecret())});
        });
    }


    validate = (decoded:IUserToken, request:Hapi.Request, callback:ICallback) => {
        let token = ObjectPath.get(decoded, 'token', '');
        let userModel = this.getUserDbService();
        let roleModel = this.getRoleDbService();
        if (!token) {
            callback(null, false);
        }
        else if (token === 'guest') {
            roleModel.getModel().findById('guest', (err, result:any) => {
                if (err) {
                    return callback(null, true);
                }
                else if (!result) {
                    return callback(null, {scope: []});
                } else {
                    return callback(null, {scope: result.privileges});
                }
            });
        }
        else {
            userModel.findByToken(token, (err:any, result) => {
                if (err) {
                    callback(null, false);
                }
                else if (!result) {
                    callback(null, false);
                }
                else if (!result.isActive) {
                    callback(null, false);
                }

                else {
                    if (!result.role) {
                        callback(null, result);
                    } else {
                        roleModel.getModel().findById(result.role, (err, res:any) => {
                            if (err) {
                                callback(err);
                            }
                            else if (!res) {
                                result.scope = [];
                                callback(null, result);
                            } else {
                                result.scope = res.privileges;
                                callback(null, result);
                            }
                        });
                    }
                }
            });
        }
    };


    login(id:string, password:string, callback:ICallback) {
        this.getUserDbService().canLogin(id, password, (err, user:any) => {
            if (err) {
                callback(err);
            }
            else if (user) {
                this.createAndAddToken(user._id, callback);
            }
            else {
                callback('invalid credentials');
            }
        });
    }

    logout(token:string, callback:ICallback) {
        this.getUserDbService().findByTokenAndRemove(token, callback);
    }

    private getUserDbService():IUserDbService {
        return this.server.settings.app.services.userDbService;
    }

    private getRoleDbService():IRoleDbService {
        return this.server.settings.app.services.roleDbService;
    }

    private getSecret():string {
        return ObjectPath.get(this.server.settings.app, 'auth.secret', '');
    }

    setServer(server:Hapi.Server):void {
        this.server = server;
    }

}

export default AuthService;
