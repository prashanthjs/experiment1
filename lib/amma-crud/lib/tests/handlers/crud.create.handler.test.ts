import Hapi = require('hapi');
import Code = require('code');
import Lab = require('lab');
import Sinon = require('sinon');
import Joi = require('joi');
import ObjectPath = require('object-path');
import Boom = require('boom');

import Handler = require('../../handlers/crud.create.handler');
import DocumentServiceFactory = require('../../services/document.service.factory');
import DocumentService = require('../../services/document.service');
import {Mongoose} from "mongoose";


const lab = exports.lab = Lab.script(),
    before = lab.before,
    after = lab.after,
    expect = Code.expect,
    suite = lab.suite,
    test = lab.test;


suite('Crud Create Handler', () => {
    const server = new Hapi.Server();
    const curdCoreHandler = new Handler.default();
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


    test('Handler', (next)=> {
        const sampleJson = {_id: 'test'};
        const route:any = {};
        const result = curdCoreHandler.handlerInit(route, options);
        expect(result).to.be.a.function();

        const stub = Sinon.stub(documentService, 'create', (payload, callback)=> {
            expect(payload).to.deep.equal(sampleJson);
            callback(null, sampleJson)
        });

        const stub1 = Sinon.stub(documentService, 'findById', (id, projs, callback)=> {
            expect(id).to.be.equal('test');
            callback(null, sampleJson)
        });

        const spy:any = Sinon.spy((res)=> {
            stub.restore();
            stub1.restore();
            expect(res).to.deep.equal(sampleJson);
            expect(spy.called).to.be.true();
            next();
        });
        const request:any = {
            payload: sampleJson
        };
        result(request, spy);
    });

    test('Handler - id exists', (next)=> {
        const sampleJson = {_id: 'test'};
        const route:any = {};
        const result = curdCoreHandler.handlerInit(route, options);
        expect(result).to.be.a.function();

        const stub = Sinon.stub(documentService, 'create', (payload, callback)=> {
            expect(payload).to.deep.equal(sampleJson);
            callback({
                code: 11000
            });
        });

        const spy:any = Sinon.spy((res)=> {
            stub.restore();
            expect(spy.calledWith(Boom.forbidden('Id exists already'))).to.be.true();
            expect(spy.called).to.be.true();
            next();
        });
        const request:any = {
            payload: sampleJson
        };
        result(request, spy);
    });

    test('Handler - error', (next)=> {
        const sampleJson = {_id: 'test'};
        const route:any = {};
        const result = curdCoreHandler.handlerInit(route, options);
        expect(result).to.be.a.function();

        const stub = Sinon.stub(documentService, 'create', (payload, callback)=> {
            expect(payload).to.deep.equal(sampleJson);
            callback('error');
        });

        const spy:any = Sinon.spy((res)=> {
            stub.restore();
            expect(spy.calledWith(Boom.forbidden('error'))).to.be.true();
            expect(spy.called).to.be.true();
            next();
        });
        const request:any = {
            payload: sampleJson
        };
        result(request, spy);
    });

    test('Handler - find by id - error', (next)=> {
        const sampleJson = {_id: 'test'};
        const route:any = {};
        const result = curdCoreHandler.handlerInit(route, options);
        expect(result).to.be.a.function();

        const stub = Sinon.stub(documentService, 'create', (payload, callback)=> {
            expect(payload).to.deep.equal(sampleJson);
            callback(null, sampleJson)
        });

        const stub1 = Sinon.stub(documentService, 'findById', (id, projs, callback)=> {
            expect(id).to.be.equal('test');
            callback('error')
        });

        const spy:any = Sinon.spy((res)=> {
            stub.restore();
            stub1.restore();
            expect(spy.calledWith(Boom.badImplementation('error'))).to.be.true();
            expect(spy.called).to.be.true();
            next();
        });
        const request:any = {
            payload: sampleJson
        };
        result(request, spy);
    });

    after((next)=> {
        stub.restore();
        next();
    });

});