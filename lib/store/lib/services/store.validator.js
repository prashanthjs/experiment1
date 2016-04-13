var Boom = require('boom');
var Joi = require('joi');
var StoreValidator = (function () {
    function StoreValidator() {
        var _this = this;
        this.parentChecker = function (id, next) {
            if (!id) {
                return next();
            }
            Joi.assert(id, Joi.string().required(), 'Invalid data provided to hapi method');
            _this.getDbService().findById(id, null, function (err, result) {
                if (err) {
                    return next(Boom.badImplementation(err));
                }
                else {
                    if (!result) {
                        return next(Boom.forbidden('Invalid parent store provided'));
                    }
                    return next();
                }
            });
        };
    }

    StoreValidator.prototype.setServer = function (server) {
        this.server = server;
    };
    StoreValidator.prototype.getDbService = function () {
        return this.server.settings.app.services.storeDbService;
    };
    return StoreValidator;
})();
Object.defineProperty(exports, "__esModule", {value: true});
exports.default = StoreValidator;
