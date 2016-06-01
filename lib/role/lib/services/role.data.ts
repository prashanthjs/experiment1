import Hapi = require('hapi');
import Async = require('async');
import {IRoleDbService} from "./role.db.service";

const data = require('../configs/data/role.data');

export interface ICallback {
    (err?:any, results?:any): any;
}

class RoleData {

    private server:Hapi.Server;

    init = (next) => {
        this.server.ext('onPreStart', this.findAndInsert);
        return next();
    };

    findAndInsert = (server, next)=> {
        const model = this.getDbService().getModel();
        Async.eachSeries(data, (record:any, callback:ICallback) => {
            model.findById(record._id, (err, result:any) => {
                if (err) {
                    callback(err);
                }
                else if (result) {
                    if (record._id === 'SuperPowerAdmin') {
                        result.privileges = this.getDbService().getAllPrivileges();
                        result.save(callback);
                    } else {
                        callback();
                    }
                }
                else {
                    if (record._id === 'SuperPowerAdmin') {
                        record.privileges = this.getDbService().getAllPrivileges();
                    }
                    model.create(record, callback);
                }
            });
        }, (err:any) => {
            return next(err);
        });
    };

    setServer(server:Hapi.Server):void {
        this.server = server;
    }

    getDbService():IRoleDbService {
        return this.server.settings.app.services.roleDbService;
    }

}

export default RoleData;
