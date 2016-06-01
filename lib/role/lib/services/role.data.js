"use strict";
var Async = require('async');
var data = require('../configs/data/role.data');
var RoleData = (function () {
    function RoleData() {
        var _this = this;
        this.init = function (next) {
            _this.server.ext('onPreStart', _this.findAndInsert);
            return next();
        };
        this.findAndInsert = function (server, next) {
            var model = _this.getDbService().getModel();
            Async.eachSeries(data, function (record, callback) {
                model.findById(record._id, function (err, result) {
                    if (err) {
                        callback(err);
                    }
                    else if (result) {
                        if (record._id === 'SuperPowerAdmin') {
                            result.privileges = _this.getDbService().getAllPrivileges();
                            result.save(callback);
                        }
                        else {
                            callback();
                        }
                    }
                    else {
                        if (record._id === 'SuperPowerAdmin') {
                            record.privileges = _this.getDbService().getAllPrivileges();
                        }
                        model.create(record, callback);
                    }
                });
            }, function (err) {
                return next(err);
            });
        };
    }
    RoleData.prototype.setServer = function (server) {
        this.server = server;
    };
    RoleData.prototype.getDbService = function () {
        return this.server.settings.app.services.roleDbService;
    };
    return RoleData;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RoleData;
