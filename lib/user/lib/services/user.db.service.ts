import Hapi = require('hapi');
import Boom = require('boom');
import Joi = require('joi');
import Bcrypt = require('bcrypt');
import Mongoose = require('mongoose');
const UserSchema = require('../configs/schema/user.schema');

export interface ICallback {
    (err?:any, results?:any): any;
}


export interface IUserDocument extends Mongoose.Document {
    password: string;
}

export interface IUserDbService {
    getModel():Mongoose.Model<Mongoose.Document>;
    findByEmail(email:string, projections:string|Object, next:ICallback):void;
    findByToken(token:string, next:(err?:any, result?:IUserDocument) => any):void;
    findByIdAndUpdateToken(id:string, token:string, next:(err?:any, results?:IUserDocument) => any):void;
    findByTokenAndRemove(token:string, next:(err?:any, results?:any) => IUserDocument):void;
    canLogin(id:string, password:string, callback:ICallback):void;
    encryptPassword(password:string , next:ICallback);

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


    findByToken(token:string, next:(err?:any, result?:IUserDocument) => any):void {
        this.getModel().findOne({token: token}).exec(next);
    }

    findByIdAndUpdateToken(id:string, token:string, next:(err?:any, results?:IUserDocument) => any):void {
        this.getModel().findById(id, (err:any, result:any) => {
            if (err) {
                next(err);
            }
            else if (!result) {
                next('User not found');
            }
            else {
                if (!result.token) {
                    result.token = [];
                }
                result.token.push(token);
                result.save(next);
            }
        });
    }

    findByTokenAndRemove(token:string, next:(err?:any, results?:any) => IUserDocument):void {
        this.findByToken(token, (err:any, result:any) => {
            if (err) {
                next(err);
            }
            else if (!result) {
                next('User not found');
            } else {
                result.token.pull(token);
                result.save(next);
            }
        });
    }

    canLogin(id:string, password:string, callback:ICallback) {
        this.getModel().findById(id).select('+password').exec((err, result:any) => {
            if (err) {
                callback(err);
            }
            else if (!result) {
                callback('user not found');
            }
            else if (!result.isActive) {
                return callback('user not active');
            }
            else {
                console.log(result.password);
                Bcrypt.compare(password, result.password, (err:any, res:boolean) => {
                    if (err) {
                        callback(err);
                    }
                    else if (!res) {
                        callback('invalid credentials');
                    }
                    else {
                        callback(null, result);
                    }
                });
            }

        });
    }

    findByIdAndUpdatePassword(id:string, password:string, next:(err?:any, result?:IUserDocument) => any):void {
        this.getModel().findById(id, (err:any, result:any) => {
            if (err || !result) {
                next('User not found');
            }
            result.password = password;
            result.save(next);
        });
    }

    encryptPassword(password:string , next:ICallback){
        Bcrypt.genSalt(10, (error, salt) => {
            Bcrypt.hash(password, salt, (err, hash) => {
                if (err) {
                    next(err);
                }
                else {
                    next(null, hash);
                }
            });
        });
    }

}

export default UserDbService;
