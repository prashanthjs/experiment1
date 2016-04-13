import Hapi = require('hapi');
import CrudGetAllHandler = require('./crud.get.all.handler');
import CrudGetHandler = require('./crud.get.handler');
import CrudCreateHandler = require('./crud.create.handler');
import CrudRemoveHandler = require('./crud.remove.handler');
import CrudUpdateHandler = require('./crud.update.handler');

class CrudFactoryHandler {
    protected server:Hapi.Server;

    setServer(server:Hapi.Server) {
        this.server = server;
    }

    handlerGetAll = (route:Hapi.IRoute, options):Hapi.ISessionHandler => {
        let cls = new CrudGetAllHandler.default();
        cls.setServer(this.server);
        return cls.handlerInit(route, options);
    };

    handlerGet = (route:Hapi.IRoute, options):Hapi.ISessionHandler => {
        let cls = new CrudGetHandler.default();
        cls.setServer(this.server);
        return cls.handlerInit(route, options);
    };

    handlerCreate = (route:Hapi.IRoute, options):Hapi.ISessionHandler => {
        let cls = new CrudCreateHandler.default();
        cls.setServer(this.server);
        return cls.handlerInit(route, options);
    };

    handlerUpdate = (route:Hapi.IRoute, options):Hapi.ISessionHandler => {
        let cls = new CrudUpdateHandler.default();
        cls.setServer(this.server);
        return cls.handlerInit(route, options);
    };

    handlerRemove = (route:Hapi.IRoute, options):Hapi.ISessionHandler => {
        let cls = new CrudRemoveHandler.default();
        cls.setServer(this.server);
        return cls.handlerInit(route, options);
    };

}
export default CrudFactoryHandler;