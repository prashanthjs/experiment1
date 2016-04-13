var Boom = require('boom');
var Joi = require('joi');
var UserEmailUniqueValidator = (function () {
    function UserEmailUniqueValidator() {
        var _this = this;
        this.userEmailUniqueValidator = function (email, next) {
            Joi.assert(email, Joi.string().required(), 'Invalid data provided to hapi method');
            _this.getUserDbService().findByEmail(email, null, function (err, result) {
                if (err) {
                    return next(err);
                }
                else {
                    if (result) {
                        return next(Boom.forbidden('Email already exists'));
                    }
                    return next();
                }
            });
        };
    }

    UserEmailUniqueValidator.prototype.setServer = function (server) {
        this.server = server;
    };
    UserEmailUniqueValidator.prototype.getUserDbService = function () {
        return this.server.settings.app.services.userDbService;
    };
    return UserEmailUniqueValidator;
})();
Object.defineProperty(exports, "__esModule", {value: true});
exports.default = UserEmailUniqueValidator;
