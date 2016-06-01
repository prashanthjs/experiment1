"use strict";
var Async = require('async');
var data = require('../configs/data/user.data');
var UserData = (function () {
    function UserData() {
        var _this = this;
        this.init = function (next) {
            _this.server.ext('onPreStart', _this.findAndInsert);
            return next();
        };
        this.findAndInsert = function (server, next) {
            var model = _this.getDbService().getModel();
            Async.eachSeries(data, function (record, callback) {
                _this.getDbService().encryptPassword(record.password, function (error, hash) {
                    if (error) {
                        callback(error);
                    }
                    else {
                        record.password = hash;
                        model.findById(record._id, function (err, result) {
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
            }, function (err) {
                return next(err);
            });
        };
    }
    UserData.prototype.setServer = function (server) {
        this.server = server;
    };
    UserData.prototype.getDbService = function () {
        return this.server.settings.app.services.userDbService;
    };
    return UserData;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = UserData;
