import Hapi = require('hapi');
import Async = require('async');
import IUserDbService from "./user.db.service";
const data = require('../configs/data/user.data');

export interface ICallback {
    (err?:any, results?:any): any;
}

class UserData {

    private server:Hapi.Server;

    init = (next) => {
        this.server.ext('onPreStart', this.findAndInsert);
        return next();
    };

    findAndInsert = (server, next)=> {
        const model = this.getDbService().getModel();
        Async.eachSeries(data, (record:any, callback:ICallback) => {
            this.getDbService().encryptPassword(record.password, (error, hash)=> {
                if (error) {
                    callback(error);
                } else {
                    record.password = hash;
                    model.findById(record._id, (err, result:any) => {
                        if (err) {
                            callback(err);
                        }
                        else if (result) {
                            callback();
                        }
                        else {
                            model.create(record, callback);
                        }
                    });
                }
            });

        }, (err:any) => {
            return next(err);
        });
    };

    setServer(server:Hapi.Server):void {
        this.server = server;
    }

    getDbService():IUserDbService {
        return this.server.settings.app.services.userDbService;
    }

}

export default UserData;
