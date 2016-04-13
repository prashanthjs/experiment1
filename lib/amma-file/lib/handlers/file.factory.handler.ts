import Hapi = require('hapi');
import FileGetHandler = require('./file.get.handler');
import FileGetAdditionalHandler = require('./file.get.additional.handler');
import FileGetTempHandler = require('./file.get.temp.handler');
import FileRemoveHandler = require('./file.remove.handler');
import FileSaveHandler = require('./file.save.handler');
import FileTokenHandler = require('./file.token.handler');
import FileUploadHandler = require('./file.upload.handler');


class FileFactoryHandler {

    protected server:Hapi.Server;

    setServer(server:Hapi.Server) {
        this.server = server;
    }

    handlerFileGet = (route:Hapi.IRoute, options):Hapi.ISessionHandler => {
        let cls = new FileGetHandler.default();
        cls.setServer(this.server);
        return cls.handlerInit(route, options);
    };

    handlerFileGetAdditional = (route:Hapi.IRoute, options):Hapi.ISessionHandler => {
        let cls = new FileGetAdditionalHandler.default();
        cls.setServer(this.server);
        return cls.handlerInit(route, options);
    };

    handlerFileGetTemp = (route:Hapi.IRoute, options):Hapi.ISessionHandler => {
        let cls = new FileGetTempHandler.default();
        cls.setServer(this.server);
        return cls.handlerInit(route, options);
    };

    handlerFileRemove = (route:Hapi.IRoute, options):Hapi.ISessionHandler => {
        let cls = new FileRemoveHandler.default();
        cls.setServer(this.server);
        return cls.handlerInit(route, options);
    };

    handlerFileSave = (route:Hapi.IRoute, options):Hapi.ISessionHandler => {
        let cls = new FileSaveHandler.default();
        cls.setServer(this.server);
        return cls.handlerInit(route, options);
    };

    handlerFileToken = (route:Hapi.IRoute, options):Hapi.ISessionHandler => {
        let cls = new FileTokenHandler.default();
        cls.setServer(this.server);
        return cls.handlerInit(route, options);
    };

    handlerFileUpload = (route:Hapi.IRoute, options):Hapi.ISessionHandler => {
        let cls = new FileUploadHandler.default();
        cls.setServer(this.server);
        return cls.handlerInit(route, options);
    };

}

export default FileFactoryHandler;