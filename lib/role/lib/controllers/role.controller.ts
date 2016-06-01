import Hapi = require('hapi');
import IRoleDbService from "../services/role.db.service";

export interface ICallback {
    (err?:any, results?:any): any;
}

class RoleController {

    private server:Hapi.Server;

    listAllPrivileges = (request:Hapi.IRequestHandler<Hapi.Request>, reply:Hapi.IReply) => {
        reply({result: this.getRoleDbService().getAllPrivileges()});
    };

    setServer(server:Hapi.Server):void {
        this.server = server;
    }

    getRoleDbService():IRoleDbService {
        return this.server.settings.app.services.roleDbService;
    }
}

export default RoleController;