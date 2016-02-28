import Hapi = require('hapi');
import Code = require('code');
import Lab = require('lab');
import Sinon = require('sinon');
import Joi = require('joi');
import ObjectPath = require('object-path');

import CurdCoreHandler = require('../../handlers/crud.core.handler');
import DocumentServiceFactory = require('../../services/document.service.factory');
import DocumentService = require('../../services/document.service');
import {Mongoose} from "mongoose";


const lab = exports.lab = Lab.script(),
    before = lab.before,
    after = lab.after,
    expect = Code.expect,
    suite = lab.suite,
    test = lab.test;


suite('Crud Core Handler', () => {
    const server = new Hapi.Server();
    const curdCoreHandler = new CurdCoreHandler.default();
    const documentServiceFactory = new DocumentServiceFactory.default();
    const documentService = new DocumentService.default();
    const options:any = {
        collectionName: 'test',
        schema: {}

    };
    let stub;

    before((next)=> {

        curdCoreHandler.setServer(server);
        documentService.setServer(server);
        documentServiceFactory.setServer(server);
        stub = Sinon.stub(documentServiceFactory, 'getDocumentService', ()=> {
            return documentService;
        });
        ObjectPath.ensureExists(server, 'settings.app.services', {});
        server.settings.app.services.documentServiceFactory = documentServiceFactory;
        next();
    });


    test('Handler Init and calling the function ', (next)=> {
        const route:any = {};
        const result = curdCoreHandler.handlerInit(route, options);
        expect(result).to.be.a.function();

        const spy:any = Sinon.spy(()=> {
            expect(spy.called).to.be.true();
            next();
        });
        const request:any = {};
        result(request, spy);
    });

    test('Get model', (next)=> {
        const route:any = {};
        const result = curdCoreHandler.handlerInit(route, options);
        expect(result).to.be.a.function();
        let model = curdCoreHandler.getModel();
        expect(model).to.be.an.instanceOf(DocumentService.default);
        model = curdCoreHandler.getModel();
        expect(model).to.be.an.instanceOf(DocumentService.default);
        next();

    });

    after((next)=> {
        stub.restore();
        next();
    });

});