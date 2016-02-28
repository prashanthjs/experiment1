import Hapi = require('hapi');
import PluginLoader = require('./lib/services/plugin.loader');
import ServiceLoader = require('./lib/services/service.loader');
import RouteLoader = require('./lib/services/route.loader');
import MethodLoader = require('./lib/services/method.loader');
import HandlerLoader = require('./lib/services/handler.loader');
import EventLoader = require('./lib/services/event.loader');


const initialisePlugin = (config:PluginLoader.IConfig)=> {
    const pluginLoader = new PluginLoader.default(config);

    const eventLoader = new EventLoader.default();
    const methodLoader = new MethodLoader.default();
    const handlerLoader = new HandlerLoader.default();
    const serviceLoader = new ServiceLoader.default();
    const routeLoader = new RouteLoader.default();


    serviceLoader.setEventLoader(eventLoader);
    serviceLoader.setMethodLoader(methodLoader);
    serviceLoader.setHandlerLoader(handlerLoader);

    pluginLoader.setRouteLoader(routeLoader);
    pluginLoader.setServiceLoader(serviceLoader);

    return pluginLoader;
};

export default initialisePlugin;