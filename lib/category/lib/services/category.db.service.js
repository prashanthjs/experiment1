"use strict";
var Mongoose = require('mongoose');
var Schema = require('../configs/schema/category.schema');
var CategoryDbService = (function () {
    function CategoryDbService() {
    }
    CategoryDbService.prototype.getModel = function () {
        if (!this.model) {
            var names = Mongoose.modelNames();
            var collectionName = Schema.collectionName;
            var schema_1 = Schema.schema;
            if (names.indexOf(collectionName) == -1) {
                this.model = Mongoose.model(collectionName, schema_1);
            }
            else {
                this.model = Mongoose.model(collectionName);
            }
        }
        return this.model;
    };
    CategoryDbService.prototype.findById = function (id, projections, next) {
        this.getModel().findById(id, projections, next);
    };
    return CategoryDbService;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CategoryDbService;
