import Hapi = require('hapi');
import Boom = require("boom");
import ObjectPath = require('object-path');
import IAuthService from "../services/auth.service";
import IUserDbService from "../services/user.db.service";

export interface ICallback {
    (err?:any, results?:any): any;
}

class UserController {

    private server:Hapi.Server;

    login = (request:Hapi.IRequestHandler<Hapi.Request>, reply:Hapi.IReply) => {
        const username = ObjectPath.get(request, 'payload._id', '');
        const password = ObjectPath.get(request, 'payload.password', '');
        this.getAuthService().login(username, password, (err, result) => {
            if (err) {
                reply(Boom.unauthorized(err));
            } else {
                reply(result);
            }
        });
    };

    logout = (request:Hapi.IRequestHandler<Hapi.Request>, reply:Hapi.IReply) => {
        const token = ObjectPath.get(request, 'headers.authorization', '');
        this.getAuthService().logout(token, (err, result) => {
            reply({success: true});
        });
    };


    updatePassword = (request:Hapi.IRequestHandler<Hapi.Request>, reply:Hapi.IReply) => {
        const username = ObjectPath.get(request, 'params.id', '');
        const password = ObjectPath.get(request, 'payload.password', '');
        this.getUserDbService().findByIdAndUpdatePassword(username, password, (err, result) => {
            if (err) {
                reply(Boom.badRequest(err));
            } else {
                reply({success: true});
            }
        });
    };

    setServer(server:Hapi.Server):void {
        this.server = server;
    }

    getAuthService():IAuthService {
        return this.server.settings.app.services.authService;
    }

    getUserDbService():IUserDbService {
        return this.server.settings.app.services.userDbService;
    }
}

export default UserController;