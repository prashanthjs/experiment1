import Hapi = require('hapi');
import Async = require('async');
import IStoreDbService from "./store.db.service";
const data = require('../configs/data/store.data');

export interface ICallback {
    (err?:any, results?:any): any;
}

class StoreData {

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
                  callback();
                }
                else {
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

    getDbService():IStoreDbService {
        return this.server.settings.app.services.storeDbService;
    }

}

export default StoreData;
