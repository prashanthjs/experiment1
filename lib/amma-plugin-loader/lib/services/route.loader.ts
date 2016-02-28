import Hapi = require('hapi');


export interface IRouteLoader {
    setServer(server:Hapi.Server):void;
    loadRoutes(routes?:any[]):void;
}

class RouteLoader implements IRouteLoader {
    private server:Hapi.Server;

    setServer(server:Hapi.Server):void {
        this.server = server;
    }

    loadRoutes(routes?:any[]):void {
        if (Array.isArray(routes) && routes.length) {
            this.server.route(routes);
        }
    }

}

export default RouteLoader;