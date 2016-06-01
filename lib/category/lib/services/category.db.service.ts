import Hapi = require('hapi');
import Boom = require('boom');
import Joi = require('joi');
import Bcrypt = require('bcrypt');
import Mongoose = require('mongoose');


const Schema = require('../configs/schema/category.schema');

export interface ICallback {
    (err?:any, results?:any): any;
}

export interface ICategoryDbService {
    getModel():Mongoose.Model<Mongoose.Document>;
    findById(id:string, projections:string|Object, next:ICallback):void;
}

class CategoryDbService implements ICategoryDbService {

    protected model:Mongoose.Model<Mongoose.Document>;

    getModel():Mongoose.Model<Mongoose.Document> {
        if (!this.model) {
            const names = Mongoose.modelNames();
            const collectionName = Schema.collectionName;
            const schema = Schema.schema;
            if (names.indexOf(collectionName) == -1) {
                this.model = Mongoose.model<Mongoose.Document>(collectionName, schema);
            } else {
                this.model = Mongoose.model<Mongoose.Document>(collectionName);
            }
        }
        return this.model;
    }

    findById(id:string, projections:string|Object, next:ICallback):void {
        this.getModel().findById(id, projections, next);
    }

}

export default CategoryDbService;
