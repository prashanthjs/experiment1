import Hapi = require('hapi');
import Boom = require('boom');
import Joi = require('joi');
import Mongoose = require('mongoose');
import DbParser = require('../../../amma-db-parser/lib/services/db.parser');

export interface ICallback {
    (err?:any, results?:any): any;
}

export interface IDocumentService {
    getModel():Mongoose.Model<Mongoose.Document>;
    findAll(options:Object, projections:string|Object, next:(err?:any, results?:Mongoose.Document[]) => any):void;
    findAllCount(options:Object, next:(err?:any, results?:Mongoose.Document[]) => any):void;
    findById(id:string, projections:string|Object, next:(err?:any, result?:Mongoose.Document) => any):void;
    findOne(options:Object, projections:string|Object, next:(err?:any, result?:Mongoose.Document) => any):void;
    create(payload:Mongoose.Document, next:(err?:any, results?:any) => any):void;
    findByIdAndUpdate(id:string, payload:Mongoose.Document, next:ICallback):void;
    findOne(options:Object, projections:string|Object, next:(err?:any, result?:Mongoose.Document) => any):void;
    create(payload:Mongoose.Document, next:(err?:any, results?:any) => any):void;
    findByIdAndUpdate(id:string, payload:Mongoose.Document, next:ICallback):void;
    findByIdAndRemove(id:string, next:ICallback):void;
    setServer(server:Hapi.Server);
    setCollectionName(collectionName:string);
    setSchema(schema:Mongoose.Schema);
    setDbParser(dbParser:DbParser.IDbParser);
}

class DocumentService implements IDocumentService {

    protected model:Mongoose.Model<Mongoose.Document>;
    protected collectionName:string;
    protected schema:Mongoose.Schema;
    protected server:Hapi.Server;
    protected dbParser:DbParser.IDbParser;

    getModel():Mongoose.Model<Mongoose.Document> {
        if (!this.model) {
            const names = Mongoose.modelNames();
            if (names.indexOf(this.collectionName) == -1) {
                this.model = Mongoose.model<Mongoose.Document>(this.collectionName, this.schema);
            } else {
                this.model = Mongoose.model<Mongoose.Document>(this.collectionName);
            }
        }
        return this.model;
    }

    findAll(options:Object, projections:string|Object, next:(err?:any, results?:Mongoose.Document[]) => any):void {
        this.dbParser.parse(options);
        const model = this.getModel();
        model.find(this.dbParser.filter, projections).sort(this.dbParser.sort).limit(this.dbParser.pageSize).skip(this.dbParser.skip).exec(next);
    }

    findAllCount(options:Object, next:(err?:any, results?:Mongoose.Document[]) => any):void {
        this.dbParser.parse(options);
        this.getModel().count(this.dbParser.filter).exec(next);
    }

    findById(id:string, projections:string|Object, next:(err?:any, result?:Mongoose.Document) => any):void {
        this.getModel().findById(id, projections).exec(next);
    }

    findOne(options:Object, projections:string|Object, next:(err?:any, result?:Mongoose.Document) => any):void {
        this.dbParser.parse(options);
        this.getModel().findOne(this.dbParser.filter, projections).exec(next);
    }

    create(payload:Mongoose.Document, next:(err?:any, results?:any) => any):void {
        this.getModel().create(payload, next);
    }

    findByIdAndUpdate(id:string, payload:Mongoose.Document, next:ICallback):void {
        this.getModel().findByIdAndUpdate(id, payload, {upsert: true}, next);
    }

    findByIdAndRemove(id:string, next:ICallback):void {
        this.getModel().findByIdAndRemove(id, next);
    }


    setServer(server:Hapi.Server):void {
        this.server = server;
    }

    setCollectionName(collectionName:string):void {
        this.collectionName = collectionName;
    }

    setSchema(schema:Mongoose.Schema):void {
        this.schema = schema;
    }

    setDbParser(dbParser:DbParser.IDbParser):void {
        this.dbParser = dbParser;
    }


}

export default DocumentService;