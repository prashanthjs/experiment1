var CrudGetAllHandler = require('./crud.get.all.handler');
var CrudGetHandler = require('./crud.get.handler');
var CrudCreateHandler = require('./crud.create.handler');
var CrudRemoveHandler = require('./crud.remove.handler');
var CrudUpdateHandler = require('./crud.update.handler');
var CrudFactoryHandler = (function () {
    function CrudFactoryHandler() {
        var _this = this;
        this.handlerGetAll = function (route, options) {
            var cls = new CrudGetAllHandler.default();
            cls.setServer(_this.server);
            return cls.handlerInit(route, options);
        };
        this.handlerGet = function (route, options) {
            var cls = new CrudGetHandler.default();
            cls.setServer(_this.server);
            return cls.handlerInit(route, options);
        };
        this.handlerCreate = function (route, options) {
            var cls = new CrudCreateHandler.default();
            cls.setServer(_this.server);
            return cls.handlerInit(route, options);
        };
        this.handlerUpdate = function (route, options) {
            var cls = new CrudUpdateHandler.default();
            cls.setServer(_this.server);
            return cls.handlerInit(route, options);
        };
        this.handlerRemove = function (route, options) {
            var cls = new CrudRemoveHandler.default();
            cls.setServer(_this.server);
            return cls.handlerInit(route, options);
        };
    }

    CrudFactoryHandler.prototype.setServer = function (server) {
        this.server = server;
    };
    return CrudFactoryHandler;
})();
Object.defineProperty(exports, "__esModule", {value: true});
exports.default = CrudFactoryHandler;
