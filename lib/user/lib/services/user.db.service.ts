import Hapi = require('hapi');
import Boom = require('boom');
import Joi = require('joi');
import Bcrypt = require('bcrypt');
import Mongoose = require('mongoose');
const UserSchema = require('../configs/schema/user.schema');

export interface ICallback {
    (err?:any, results?:any): any;
}

export interface IUserDbService {
    getModel():Mongoose.Model<Mongoose.Document>;
    findByEmail(email:string, projections:string|Object, next:ICallback):void;
}

class UserDbService implements IUserDbService {

    protected model:Mongoose.Model<Mongoose.Document>;

    getModel():Mongoose.Model<Mongoose.Document> {
        if (!this.model) {
            const names = Mongoose.modelNames();
            const collectionName = UserSchema.collectionName;
            const schema = UserSchema.schema;
            if (names.indexOf(collectionName) == -1) {
                this.model = Mongoose.model<Mongoose.Document>(collectionName, schema);
            } else {
                this.model = Mongoose.model<Mongoose.Document>(collectionName);
            }
        }
        return this.model;
    }

    findByEmail(email:string, projections:string|Object, next:ICallback):void {
        this.getModel().findOne({email: email}, projections, next);
    }

}

export default UserDbService;
