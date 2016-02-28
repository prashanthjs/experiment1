import Hapi = require('hapi');
import Code = require('code');
import Lab = require('lab');
import Sinon = require('sinon');
import Joi = require('joi');
import ObjectPath = require('object-path');
import FileManager = require('../../services/file.manager');
import FileHelper = require('../../services/file.helper');
import FileFactory = require( "../../services/file.factory");
import FileSaveHandler = require( "../../handlers/file.save.handler");
import TestData = require('./data/test-data');

const lab = exports.lab = Lab.script(),
    before = lab.before,
    beforeEach = lab.beforeEach,
    afterEach = lab.afterEach,
    after = lab.after,
    expect = Code.expect,
    suite = lab.suite,
    test = lab.test;

suite('File Save Handler', () => {

    const server = new Hapi.Server();
    const fileSaveHandler = new FileSaveHandler.default();
    const fileFactory = new FileFactory.default();
    const fileManager = new FileManager.default();
    const fileOptions = TestData.default.fileOptions;
    const options = TestData.default.options;
    const request:any = TestData.default.request;
    const fileHelper = new FileHelper.default(fileManager, fileOptions, null, null);

    before((next)=> {
        fileSaveHandler.setServer(server);
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
        const stub = Sinon.stub(fileHelper, 'syncTempToSrc', (callback)=> {
            callback();
        });
        const spy:any = Sinon.spy((result)=> {
            stub.restore();
            expect(spy.called).to.true();
            expect(result.success).to.be.true();
            next();
        });
        const result = fileSaveHandler.handlerInit(request, options);
        result(request, spy);
    });
    test('Handler - failure', (next)=> {
        const stub = Sinon.stub(fileHelper, 'syncTempToSrc', (callback)=> {
            callback('error');
        });
        const spy:any = Sinon.spy((result)=> {
            stub.restore();
            expect(spy.called).to.true();
            expect(result.success).not.to.be.exist();
            next();
        });
        const result = fileSaveHandler.handlerInit(request, options);
        result(request, spy);
    });
    afterEach((next)=> {
        stub.restore();
        next();
    });
});