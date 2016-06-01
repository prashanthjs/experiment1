"use strict";
var ObjectPath = require('object-path');
var JWT = require('jsonwebtoken');
var UUID = require('node-uuid');
var HapiAuthJwt = require('hapi-auth-jwt2');
var AuthService = (function () {
    function AuthService() {
        var _this = this;
        this.init = function (next) {
            _this.server.ext('onRequest', _this.onRequest);
            _this.server.register(HapiAuthJwt, function (err) {
                _this.guestToken = _this.createGuestToken();
                if (err) {
                    return next(err);
                }
                _this.server.auth.strategy('jwt', 'jwt', false, {
                    key: _this.getSecret(),
                    validateFunc: _this.validate,
                    verifyOptions: { ignoreExpiration: true }
                });
                _this.server.auth.default('jwt');
                return next();
            });
        };
        this.onRequest = function (request, reply) {
            var authToken = ObjectPath.get(request.headers, 'authorization', null);
            if (!authToken) {
                ObjectPath.set(request.headers, 'authorization', _this.guestToken);
            }
            reply.continue();
        };
        this.validate = function (decoded, request, callback) {
            var token = ObjectPath.get(decoded, 'token', '');
            var userModel = _this.getUserDbService();
            var roleModel = _this.getRoleDbService();
            if (!token) {
                callback(null, false);
            }
            else if (token === 'guest') {
                roleModel.getModel().findById('guest', function (err, result) {
                    if (err) {
                        return callback(null, true);
                    }
                    else if (!result) {
                        return callback(null, { scope: [] });
                    }
                    else {
                        return callback(null, { scope: result.privileges });
                    }
                });
            }
            else {
                userModel.findByToken(token, function (err, result) {
                    if (err) {
                        callback(null, false);
                    }
                    else if (!result) {
                        callback(null, false);
                    }
                    else if (!result.isActive) {
                        callback(null, false);
                    }
                    else {
                        if (!result.role) {
                            callback(null, result);
                        }
                        else {
                            roleModel.getModel().findById(result.role, function (err, res) {
                                if (err) {
                                    callback(err);
                                }
                                else if (!res) {
                                    result.scope = [];
                                    callback(null, result);
                                }
                                else {
                                    result.scope = res.privileges;
                                    callback(null, result);
                                }
                            });
                        }
                    }
                });
            }
        };
    }
    AuthService.prototype.createGuestToken = function () {
        var token = 'guest';
        return JWT.sign({ token: token }, this.getSecret());
    };
    AuthService.prototype.createAndAddToken = function (id, next) {
        var _this = this;
        var token = UUID.v1();
        var userModel = this.getUserDbService();
        userModel.findByIdAndUpdateToken(id, token, function (err) {
            if (err) {
                return next(err);
            }
            return next(null, { token: JWT.sign({ token: token }, _this.getSecret()) });
        });
    };
    AuthService.prototype.login = function (id, password, callback) {
        var _this = this;
        this.getUserDbService().canLogin(id, password, function (err, user) {
            if (err) {
                callback(err);
            }
            else if (user) {
                _this.createAndAddToken(user._id, callback);
            }
            else {
                callback('invalid credentials');
            }
        });
    };
    AuthService.prototype.logout = function (token, callback) {
        this.getUserDbService().findByTokenAndRemove(token, callback);
    };
    AuthService.prototype.getUserDbService = function () {
        return this.server.settings.app.services.userDbService;
    };
    AuthService.prototype.getRoleDbService = function () {
        return this.server.settings.app.services.roleDbService;
    };
    AuthService.prototype.getSecret = function () {
        return ObjectPath.get(this.server.settings.app, 'auth.secret', '');
    };
    AuthService.prototype.setServer = function (server) {
        this.server = server;
    };
    return AuthService;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AuthService;
