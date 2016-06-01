"use strict";
var Boom = require("boom");
var ObjectPath = require('object-path');
var UserController = (function () {
    function UserController() {
        var _this = this;
        this.login = function (request, reply) {
            var username = ObjectPath.get(request, 'payload._id', '');
            var password = ObjectPath.get(request, 'payload.password', '');
            _this.getAuthService().login(username, password, function (err, result) {
                if (err) {
                    reply(Boom.unauthorized(err));
                }
                else {
                    reply(result);
                }
            });
        };
        this.logout = function (request, reply) {
            var token = ObjectPath.get(request, 'headers.authorization', '');
            _this.getAuthService().logout(token, function (err, result) {
                reply({ success: true });
            });
        };
        this.updatePassword = function (request, reply) {
            var username = ObjectPath.get(request, 'params.id', '');
            var password = ObjectPath.get(request, 'payload.password', '');
            _this.getUserDbService().findByIdAndUpdatePassword(username, password, function (err, result) {
                if (err) {
                    reply(Boom.badRequest(err));
                }
                else {
                    reply({ success: true });
                }
            });
        };
    }
    UserController.prototype.setServer = function (server) {
        this.server = server;
    };
    UserController.prototype.getAuthService = function () {
        return this.server.settings.app.services.authService;
    };
    UserController.prototype.getUserDbService = function () {
        return this.server.settings.app.services.userDbService;
    };
    return UserController;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = UserController;
