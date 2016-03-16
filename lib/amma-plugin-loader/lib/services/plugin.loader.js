var Hoek = require('hoek');
var Schema = require('../schema/schema');
var Joi = require('joi');
var PluginLoader = (function () {
    function PluginLoader(config) {
        var _this = this;
        /**
         *
         * @param server
         * @param options
         * @param next
         */
        this.register = function (server, options, next) {
            server.bind(_this);
            _this.setServer(server);
            _this.config = Hoek.merge(_this.config, options);
            server.expose('config', _this.config);
            _this.parseAppSettings();
            _this.serviceLoader.loadServices(_this.config.services, function (err) {
                var routes = _this.config.routes;
                _this.routeLoader.loadRoutes(routes);
                next(err);
            });
        };
        this.config = Joi.attempt(config, Schema.default.ConfigSchema, 'Invalid config');
        this.register.attributes = this.config.attributes;
    }
    PluginLoader.prototype.parseAppSettings = function () {
        var app = this.config.app;
        if (app) {
            if (this.server.settings.app) {
                this.server.settings.app = Hoek.merge(this.config.app, this.server.settings.app, false, true);
            }
            else {
                this.server.settings.app = app;
            }
        }
    };
    PluginLoader.prototype.setServer = function (server) {
        this.server = server;
        this.serviceLoader.setServer(server);
        this.routeLoader.setServer(server);
    };
    PluginLoader.prototype.setServiceLoader = function (serviceLoader) {
        this.serviceLoader = serviceLoader;
    };
    PluginLoader.prototype.setRouteLoader = function (routeLoader) {
        this.routeLoader = routeLoader;
    };
    return PluginLoader;
})();
exports.PluginLoader = PluginLoader;
Object.defineProperty(exports, "__esModule", {value: true});
exports.default = PluginLoader;
