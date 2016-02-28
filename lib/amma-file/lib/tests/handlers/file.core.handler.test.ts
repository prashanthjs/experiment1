import Hapi = require('hapi');
import Code = require('code');
import Lab = require('lab');
import Sinon = require('sinon');
import Joi = require('joi');
import ObjectPath = require('object-path');
import FileCoreHandler = require('../../handlers/file.core.handler');
import FileManager = require('../../services/file.manager');
import FileHelper = require('../../services/file.helper');
import FileFactory = require( "../../services/file.factory");
import TestData = require('./data/test-data');

const lab = exports.lab = Lab.script(),
    before = lab.before,
    expect = Code.expect,
    suite = lab.suite,
    test = lab.test;

suite('File Core Handler', () => {
    const server = new Hapi.Server();
    const fileCoreHandler = new FileCoreHandler.default();
    const fileFactory = new FileFactory.default();
    const fileManager = new FileManager.default();
    const fileOptions = TestData.default.fileOptions;
    const options = TestData.default.options;
    const request:any = TestData.default.request;
    before((next)=> {
        fileCoreHandler.setServer(server);
        ObjectPath.ensureExists(server, 'settings.app.services', {});
        server.settings.app.services.fileFactory = fileFactory;
        server.settings.app.services.fileManager = fileManager;
        next();
    });


    test('Handler Init ', (next)=> {
        const options:any = {'test': 'test'};
        const stub = Sinon.stub(Joi, 'attempt', (opts, schema, message)=> {
            expect(opts).to.be.only.include(options);
            return opts;
        });
        let route:any = {};
        const result = fileCoreHandler.handlerInit(route, options);
        stub.restore();
        expect(result).to.be.a.function();
        next();
    });

    test('Handler', (next)=> {
        const spy:any = Sinon.spy(()=> {
            expect(spy.called).to.be.true();
            next();
        });
        fileCoreHandler.handler(request, spy);
    });

    test('Get ExtPath - success ', (next)=> {
        const stub = Sinon.stub(ObjectPath, 'has', ()=> {
            return true;
        });
        const stub1 = Sinon.stub(ObjectPath, 'get', ()=> {
            return 'test1';
        });
        const result = fileCoreHandler.getExtpath(request);
        expect(result).to.be.equal('test1');
        stub.restore();
        stub1.restore();
        next();
    });
    test('Get ExtPath - failure ', (next)=> {
        const stub = Sinon.stub(ObjectPath, 'has', ()=> {
            return false;
        });
        const request:any = {};
        const result = fileCoreHandler.getExtpath(request);
        expect(result).to.be.null();
        stub.restore();
        next();
    });

    test('Get Token - success ', (next)=> {
        const stub = Sinon.stub(ObjectPath, 'has', ()=> {
            return true;
        });
        const stub1 = Sinon.stub(ObjectPath, 'get', ()=> {
            return 'test1';
        });
        const result = fileCoreHandler.getToken(request);
        expect(result).to.be.equal('test1');
        stub.restore();
        stub1.restore();
        next();
    });
    test('Get Token - failure ', (next)=> {
        const stub = Sinon.stub(ObjectPath, 'has', ()=> {
            return false;
        });
        const result = fileCoreHandler.getToken(request);
        expect(result).to.be.null();
        stub.restore();
        next();
    });

    test('Get File Helper Instance', (next)=> {
        const fileHelper = new FileHelper.default(fileManager, fileOptions, 'test', 'test');
        const stub = Sinon.stub(fileFactory, 'getInstance', () => {
            return fileHelper;
        });
        const result = fileCoreHandler.getFileHelperInstance(request);
        expect(result).to.be.an.instanceOf(FileHelper.default);
        stub.restore();
        next();
    });


});