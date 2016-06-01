"use strict";
var Bcrypt = require('bcrypt');
var Mongoose = require('mongoose');
var UserSchema = require('../configs/schema/user.schema');
var UserDbService = (function () {
    function UserDbService() {
    }
    UserDbService.prototype.getModel = function () {
        if (!this.model) {
            var names = Mongoose.modelNames();
            var collectionName = UserSchema.collectionName;
            var schema_1 = UserSchema.schema;
            if (names.indexOf(collectionName) == -1) {
                this.model = Mongoose.model(collectionName, schema_1);
            }
            else {
                this.model = Mongoose.model(collectionName);
            }
        }
        return this.model;
    };
    UserDbService.prototype.findByEmail = function (email, projections, next) {
        this.getModel().findOne({ email: email }, projections, next);
    };
    UserDbService.prototype.findByToken = function (token, next) {
        this.getModel().findOne({ token: token }).exec(next);
    };
    UserDbService.prototype.findByIdAndUpdateToken = function (id, token, next) {
        this.getModel().findById(id, function (err, result) {
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
    };
    UserDbService.prototype.findByTokenAndRemove = function (token, next) {
        this.findByToken(token, function (err, result) {
            if (err) {
                next(err);
            }
            else if (!result) {
                next('User not found');
            }
            else {
                result.token.pull(token);
                result.save(next);
            }
        });
    };
    UserDbService.prototype.canLogin = function (id, password, callback) {
        this.getModel().findById(id).select('+password').exec(function (err, result) {
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
                Bcrypt.compare(password, result.password, function (err, res) {
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
    };
    UserDbService.prototype.findByIdAndUpdatePassword = function (id, password, next) {
        this.getModel().findById(id, function (err, result) {
            if (err || !result) {
                next('User not found');
            }
            result.password = password;
            result.save(next);
        });
    };
    UserDbService.prototype.encryptPassword = function (password, next) {
        Bcrypt.genSalt(10, function (error, salt) {
            Bcrypt.hash(password, salt, function (err, hash) {
                if (err) {
                    next(err);
                }
                else {
                    next(null, hash);
                }
            });
        });
    };
    return UserDbService;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = UserDbService;
