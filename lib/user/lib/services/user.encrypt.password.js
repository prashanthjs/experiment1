"use strict";
var Boom = require('boom');
var UserEncryptPassword = (function () {
    function UserEncryptPassword() {
        var _this = this;
        this.encryptPasswordRequest = function (request, reply) {
            _this.getUserDbService().encryptPassword(request.payload.password, function (err, hash) {
                if (err) {
                    reply(Boom.badImplementation(err));
                }
                else {
                    request.payload.password = hash;
                    reply({});
                }
            });
        };
    }
    UserEncryptPassword.prototype.getUserDbService = function () {
        return this.server.settings.app.services.userDbService;
    };
    UserEncryptPassword.prototype.setServer = function (server) {
        this.server = server;
    };
    return UserEncryptPassword;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = UserEncryptPassword;
