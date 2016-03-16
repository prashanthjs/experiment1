var Boom = require('boom');
var Joi = require('joi');
var WhitelabelValidator = (function () {
    function WhitelabelValidator() {
        var _this = this;
        this.parentChecker = function (id, next) {
            if (!id) {
                return next();
            }
            Joi.assert(id, Joi.string().required(), 'Invalid data provided to hapi method');
            _this.getWhitelabelDbService().findById(id, null, function (err, result) {
                if (err) {
                    return next(Boom.badImplementation(err));
                }
                else {
                    if (!result) {
                        return next(Boom.forbidden('Invalid parent whitelabel provided'));
                    }
                    return next();
                }
            });
        };
    }

    WhitelabelValidator.prototype.setServer = function (server) {
        this.server = server;
    };
    WhitelabelValidator.prototype.getWhitelabelDbService = function () {
        return this.server.settings.app.services.whitelabelDbService;
    };
    return WhitelabelValidator;
})();
Object.defineProperty(exports, "__esModule", {value: true});
exports.default = WhitelabelValidator;
