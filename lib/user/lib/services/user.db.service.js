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
        this.getModel().findOne({email: email}, projections, next);
    };
    return UserDbService;
})();
Object.defineProperty(exports, "__esModule", {value: true});
exports.default = UserDbService;
