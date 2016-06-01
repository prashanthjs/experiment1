"use strict";
var Mongoose = require('mongoose');
var RoleSchema = require('../configs/schema/role.schema');
var RoleDbService = (function () {
    function RoleDbService() {
    }
    RoleDbService.prototype.getModel = function () {
        if (!this.model) {
            var names = Mongoose.modelNames();
            var collectionName = RoleSchema.collectionName;
            var schema_1 = RoleSchema.schema;
            if (names.indexOf(collectionName) == -1) {
                this.model = Mongoose.model(collectionName, schema_1);
            }
            else {
                this.model = Mongoose.model(collectionName);
            }
        }
        return this.model;
    };
    RoleDbService.prototype.getAllPrivileges = function () {
        return this.server.settings.app.privileges;
    };
    ;
    RoleDbService.prototype.setServer = function (server) {
        this.server = server;
    };
    return RoleDbService;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RoleDbService;
