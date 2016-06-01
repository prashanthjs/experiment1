"use strict";
var RoleController = (function () {
    function RoleController() {
        var _this = this;
        this.listAllPrivileges = function (request, reply) {
            reply({ result: _this.getRoleDbService().getAllPrivileges() });
        };
    }
    RoleController.prototype.setServer = function (server) {
        this.server = server;
    };
    RoleController.prototype.getRoleDbService = function () {
        return this.server.settings.app.services.roleDbService;
    };
    return RoleController;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RoleController;
