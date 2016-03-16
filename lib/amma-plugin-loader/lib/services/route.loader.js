var RouteLoader = (function () {
    function RouteLoader() {
    }
    RouteLoader.prototype.setServer = function (server) {
        this.server = server;
    };
    RouteLoader.prototype.loadRoutes = function (routes) {
        if (Array.isArray(routes) && routes.length) {
            this.server.route(routes);
        }
    };
    return RouteLoader;
})();
Object.defineProperty(exports, "__esModule", {value: true});
exports.default = RouteLoader;
