import Hapi = require('hapi');
import Code = require('code');
import Lab = require('lab');
import Sinon = require('sinon');
import Joi = require('joi');
import ObjectPath = require('object-path');
import Boom = require('boom');

import Handler = require('../../handlers/crud.update.handler');
import DocumentServiceFactory = require('../../services/document.service.factory');
import DocumentService = require('../../services/document.service');
import {Mongoose} from "mongoose";


const lab = exports.lab = Lab.script(),
    before = lab.before,
    after = lab.after,
    expect = Code.expect,
    suite = lab.suite,
    test = lab.test;


suite('Crud Update Handler', () => {
    const server = new Hapi.Server();
    const curdCoreHandler = new Handler.default();
    const documentServiceFactory = new DocumentServiceFactory.default();
    const documentService = new DocumentService.default();
    const options:any = {
        collectionName: 'test',
        schema: {},
        idPath: 'params._id'
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

        const stub = Sinon.stub(documentService, 'findByIdAndUpdate', (id, payload, callback)=> {
            expect(payload).to.deep.equal(sampleJson);
            expect(id).to.be.equal('test');
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
            params: {
                _id: 'test'
            },
            payload: sampleJson
        };
        result(request, spy);
    });

    test('Handler - save error', (next)=> {
        const sampleJson = {_id: 'test'};
        const route:any = {};
        const result = curdCoreHandler.handlerInit(route, options);
        expect(result).to.be.a.function();

        const stub = Sinon.stub(documentService, 'findByIdAndUpdate', (id, payload, callback)=> {
            expect(payload).to.deep.equal(sampleJson);
            expect(id).to.be.equal('test');
            callback('error')
        });

        const stub1 = Sinon.stub(documentService, 'findById', (id, projs, callback)=> {
            expect(id).to.be.equal('test');
            callback(null, sampleJson)
        });

        const spy:any = Sinon.spy((res)=> {
            stub.restore();
            stub1.restore();
            expect(spy.calledWith(Boom.forbidden('error'))).to.be.true();
            expect(spy.called).to.be.true();
            next();
        });
        const request:any = {
            params: {
                _id: 'test'
            },
            payload: sampleJson
        };
        result(request, spy);
    });
    test('Handler - id not found', (next)=> {
        const sampleJson = {_id: 'test'};
        const route:any = {};
        const result = curdCoreHandler.handlerInit(route, options);
        expect(result).to.be.a.function();

        const stub = Sinon.stub(documentService, 'findById', (id, projs, callback)=> {
            expect(id).to.be.equal('test');
            callback(null, null)
        });

        const spy:any = Sinon.spy((res)=> {
            stub.restore();
            expect(spy.calledWith(Boom.notFound('Not found'))).to.be.true();
            expect(spy.called).to.be.true();
            next();
        });
        const request:any = {
            params: {
                _id: 'test'
            },
            payload: sampleJson
        };
        result(request, spy);
    });

    test('Handler - first call error', (next)=> {
        const sampleJson = {_id: 'test'};
        const route:any = {};
        const result = curdCoreHandler.handlerInit(route, options);
        expect(result).to.be.a.function();

        const stub = Sinon.stub(documentService, 'findById', (id, projs, callback)=> {
            expect(id).to.be.equal('test');
            callback('error', null)
        });

        const spy:any = Sinon.spy((res)=> {
            stub.restore();
            expect(spy.calledWith(Boom.badImplementation('error'))).to.be.true();
            expect(spy.called).to.be.true();
            next();
        });
        const request:any = {
            params: {
                _id: 'test'
            },
            payload: sampleJson
        };
        result(request, spy);
    });

    test('Handler - second call error', (next)=> {
        const sampleJson = {_id: 'test'};
        const route:any = {};
        const result = curdCoreHandler.handlerInit(route, options);
        expect(result).to.be.a.function();

        const stub = Sinon.stub(documentService, 'findByIdAndUpdate', (id, payload, callback)=> {
            expect(payload).to.deep.equal(sampleJson);
            expect(id).to.be.equal('test');
            callback(null, sampleJson);
        });

        let i = 0;
        const stub1 = Sinon.stub(documentService, 'findById', (id, projs, callback)=> {
            expect(id).to.be.equal('test');
            if (i === 0) {
                i++;
                callback(null, sampleJson)
            } else {
                i++;
                callback('error')
            }

        });

        const spy:any = Sinon.spy((res)=> {
            stub.restore();
            stub1.restore();
            expect(spy.calledWith(Boom.badImplementation('error'))).to.be.true();
            expect(spy.called).to.be.true();
            next();
        });
        const request:any = {
            params: {
                _id: 'test'
            },
            payload: sampleJson
        };
        result(request, spy);
    });

    after((next)=> {
        stub.restore();
        next();
    });

});