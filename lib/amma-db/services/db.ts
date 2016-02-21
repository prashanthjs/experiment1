import Mongoose = require("mongoose");
import Hapi = require("hapi");

export interface IDbOptions {
        uri: string,
        options?: Object
}

export interface ICallback {
    (err?:any, results?:any): any;
}

export interface IDb {
    getOptions(): IDbOptions;
    connectDb(next:(err?:any, result?:any) => any): any;
    disconnectDb(next:(err?:any, result?:any) => any): any;
}

class Db implements IDb {
    protected server:Hapi.Server;

    public getOptions():IDbOptions {
        return this.server.settings.app.db;
    }

    public setServer = (server:Hapi.Server) => {
        this.server = server;
    };

    public init = (next:ICallback) => {
        this.connectDb(next);
    };

    public connectDb = (next:ICallback) => {
        let options = this.getOptions();

        const db = Mongoose.connect(options.uri, options.options, (err:any) => {
            if (err) {
                this.server.log('error', 'Could not connect to MongoDB! ' + options.uri + '\n');
                next(err);
            } else {
                this.server.log('success', 'Connected to MongoDB ' + options.uri + '\n');
                next();
            }
        });
        this.server.expose('db', db);
    };

    public disconnectDb = (next:(err?:any, result?:any) => any):any => {
        Mongoose.disconnect((err) => {
            this.server.log('Disconnected from MongoDB.');
            return next();
        });
    };

}

export default Db;
