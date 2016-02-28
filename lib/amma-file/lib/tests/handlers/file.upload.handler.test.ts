import Hapi = require('hapi');
import Code = require('code');
import Lab = require('lab');
import Sinon = require('sinon');
import Joi = require('joi');
import ObjectPath = require('object-path');
import FileManager = require('../../services/file.manager');
import FileHelper = require('../../services/file.helper');
import FileFactory = require( "../../services/file.factory");
import FileUploadHandler = require( "../../handlers/file.upload.handler");
import TestData = require('./data/test-data');

const lab = exports.lab = Lab.script(),
    before = lab.before,
    beforeEach = lab.beforeEach,
    afterEach = lab.afterEach,
    after = lab.after,
    expect = Code.expect,
    suite = lab.suite,
    test = lab.test;

suite('File Upload Handler', () => {

    const server = new Hapi.Server();
    const fileUploadHandler = new FileUploadHandler.default();
    const fileFactory = new FileFactory.default();
    const fileManager = new FileManager.default();
    const fileOptions = TestData.default.fileOptions;
    const options = TestData.default.options;
    const request:any = TestData.default.request;
    const fileHelper = new FileHelper.default(fileManager, fileOptions, null, null);
    before((next)=> {
        fileUploadHandler.setServer(server);
        ObjectPath.ensureExists(server, 'settings.app.services', {});
        server.settings.app.services.fileFactory = fileFactory;
        server.settings.app.services.fileManager = fileManager;
        fileFactory.setServer(server);
        next();
    });

    let stub;
    beforeEach((next)=> {
        stub = Sinon.stub(fileFactory, 'getInstance', () => {
            return fileHelper;
        });
        next();
    });

    test('Handler - success', (next)=> {
        const stub = Sinon.stub(fileHelper, 'upload', (file, fileName, callback)=> {
            expect(fileName).to.be.equal(request.payload.file.hapi.filename);
            expect(file).to.only.include(request.payload.file);
            callback(null, {
                filename: request.payload.file.hapi.filename
            });
        });
        const spy:any = Sinon.spy((result)=> {
            stub.restore();
            expect(spy.called).to.true();
            expect(result.filename).to.be.equal(request.payload.file.hapi.filename);
            expect(result.headers).to.only.include(request.payload.file.hapi.headers);
            next();
        });
        const result = fileUploadHandler.handlerInit(request, options);
        result(request, spy);
    });
    test('Handler - failure', (next)=> {
        const stub = Sinon.stub(fileHelper, 'upload', (file, fileName, callback)=> {
            expect(fileName).to.be.equal(request.payload.file.hapi.filename);
            expect(file).to.only.include(request.payload.file);
            callback('error');
        });
        const spy:any = Sinon.spy((result)=> {
            stub.restore();
            expect(spy.called).to.true();
            expect(result.filename).not.to.be.exist();
            next();
        });
        const result = fileUploadHandler.handlerInit(request, options);
        result(request, spy);
    });
    afterEach((next)=> {
        stub.restore();
        next();
    });
});