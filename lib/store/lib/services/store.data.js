"use strict";
var Async = require('async');
var data = require('../configs/data/store.data');
var StoreData = (function () {
    function StoreData() {
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
                        callback();
                    }
                    else {
                        model.create(record, callback);
                    }
                });
            }, function (err) {
                return next(err);
            });
        };
    }
    StoreData.prototype.setServer = function (server) {
        this.server = server;
    };
    StoreData.prototype.getDbService = function () {
        return this.server.settings.app.services.storeDbService;
    };
    return StoreData;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = StoreData;
