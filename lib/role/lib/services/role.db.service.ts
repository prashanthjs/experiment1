import Hapi = require('hapi');
import Boom = require('boom');
import Joi = require('joi');
import Bcrypt = require('bcrypt');
import Mongoose = require('mongoose');
const RoleSchema = require('../configs/schema/role.schema');

export interface ICallback {
    (err?:any, results?:any): any;

}

export interface IRoleDbService {
    getModel():Mongoose.Model<Mongoose.Document>;
    getAllPrivileges():string[];
}

class RoleDbService implements IRoleDbService {

    protected model:Mongoose.Model<Mongoose.Document>;
    private server:Hapi.Server;

    getModel():Mongoose.Model<Mongoose.Document> {
        if (!this.model) {
            const names = Mongoose.modelNames();
            const collectionName = RoleSchema.collectionName;
            const schema = RoleSchema.schema;
            if (names.indexOf(collectionName) == -1) {
                this.model = Mongoose.model<Mongoose.Document>(collectionName, schema);
            } else {
                this.model = Mongoose.model<Mongoose.Document>(collectionName);
            }
        }
        return this.model;
    }

    getAllPrivileges():string[] {
        return this.server.settings.app.privileges;
    };

    setServer(server:Hapi.Server):void {
        this.server = server;
    }

}

export default RoleDbService;
