var Hoek = require('hoek');
var Items = require('items');
var ObjectPath = require('object-path');
var _ = require('lodash');
var PluginLoader = (function () {
    /**
     *
     * @param config
     */
    function PluginLoader(config) {
        var _this = this;
        this.config = config;
        /**
         *
         * @param server
         * @param options
         * @param next
         */
        this.register = function (server, options, next) {
            server.bind(_this);
            _this.server = server;
            _this.config = Hoek.merge(_this.config, options);
            server.expose('config', _this.config);
            _this.parseAppSettings();
            _this.loadServices(function (err) {
                if (err) {
                    next(err);
                }
                else {
                    _this.loadRoutes();
                    next();
                }
            });
        };
        this.register.attributes = this.config.attributes;
    }
    PluginLoader.prototype.loadRoutes = function () {
        var routes = this.config.routes;
        if (routes) {
            this.server.route(routes);
        }
    };
    /**
     *
     */
    PluginLoader.prototype.parseAppSettings = function () {
        var app = this.config.app;
        if (app) {
            Hoek.assert(typeof app === 'object' || typeof app === null || typeof app === "undefined", 'Config App setting should be an object or undefined or null');
            if (this.server.settings.app) {
                this.server.settings.app = Hoek.merge(this.config.app, this.server.settings.app);
            }
            else {
                this.server.settings.app = app;
            }
        }
    };
    /**
     *
     * @param next
     */
    PluginLoader.prototype.loadServices = function (next) {
        var _this = this;
        var services = this.config.services;
        if (services) {
            Hoek.assert(typeof services === 'object', 'services should be an object');
            var callBackArray = [];
            _.forEach(services, function (service, key) {
                _this.loadService(service, key, callBackArray);
            });
            this.loadCallbacks(callBackArray, next);
        }
        else {
            next();
        }
    };
    /**
     *
     * @param service
     * @param callBackArray
     */
    PluginLoader.prototype.loadService = function (service, key, callBackArray) {
        Hoek.assert(typeof service.cls === 'function', 'Invalid service class');
        var ServiceClass = service.cls;
        var cls = new ServiceClass();
        if (ObjectPath.has(cls, 'setServer')) {
            cls.setServer(this.server);
        }
        if (ObjectPath.has(cls, 'init')) {
            callBackArray.push(cls.init);
        }
        if (service.methods) {
            var methods = service.methods;
            Hoek.assert(Array.isArray(methods), 'service method should be an array');
            for (var i = 0; i < methods.length; i++) {
                this.loadMethod(methods[i], cls);
            }
        }
        this.server.expose(key, cls);
    };
    PluginLoader.prototype.loadMethod = function (method, cls) {
        var methodName = method.methodName;
        var options = method.options;
        var name = method.name;
        Hoek.assert(typeof methodName === 'string', 'services method name should be a string');
        Hoek.assert(typeof name === 'string', 'service name should be a string');
        Hoek.assert(ObjectPath.has(cls, methodName), 'Invalid service method');
        var func = ObjectPath.get(cls, methodName);
        this.server.method(name, func, options);
    };
    /**
     *
     * @param callbackArray
     * @param next
     */
    PluginLoader.prototype.loadCallbacks = function (callbackArray, next) {
        if (callbackArray && callbackArray.length) {
            Items.serial(callbackArray, function (item, done) {
                item(done);
            }, function (error) {
                if (error) {
                    next(error);
                }
                else {
                    next();
                }
            });
        }
        else {
            return next();
        }
    };
    return PluginLoader;
})();
exports.PluginLoader = PluginLoader;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PluginLoader;
