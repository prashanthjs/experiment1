var Mongoose = require('mongoose');
var whitelabelSchema = require('../configs/schema/whitelabel.schema');
var WhitelabelDbService = (function () {
    function WhitelabelDbService() {
    }

    WhitelabelDbService.prototype.getModel = function () {
        if (!this.model) {
            var names = Mongoose.modelNames();
            var collectionName = whitelabelSchema.collectionName;
            var schema_1 = whitelabelSchema.schema;
            if (names.indexOf(collectionName) == -1) {
                this.model = Mongoose.model(collectionName, schema_1);
            }
            else {
                this.model = Mongoose.model(collectionName);
            }
        }
        return this.model;
    };
    WhitelabelDbService.prototype.findById = function (id, projections, next) {
        this.getModel().findById(id, projections, next);
    };
    return WhitelabelDbService;
})();
Object.defineProperty(exports, "__esModule", {value: true});
exports.default = WhitelabelDbService;
