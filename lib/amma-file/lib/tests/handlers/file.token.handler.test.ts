import Hapi = require('hapi');
import Code = require('code');
import Lab = require('lab');
import Sinon = require('sinon');
import Joi = require('joi');
import ObjectPath = require('object-path');
import FileManager = require('../../services/file.manager');
import FileHelper = require('../../services/file.helper');
import FileFactory = require( "../../services/file.factory");
import FileTokenHandler = require( "../../handlers/file.token.handler");
import TestData = require('./data/test-data');

const lab = exports.lab = Lab.script(),
    before = lab.before,
    beforeEach = lab.beforeEach,
    afterEach = lab.afterEach,
    after = lab.after,
    expect = Code.expect,
    suite = lab.suite,
    test = lab.test;

suite('File Token Handler', () => {

    const server = new Hapi.Server();
    const fileTokenHandler = new FileTokenHandler.default();
    const fileFactory = new FileFactory.default();
    const fileManager = new FileManager.default();
    const fileOptions = TestData.default.fileOptions;
    const options = TestData.default.options;
    const request:any = TestData.default.request;
    const fileHelper = new FileHelper.default(fileManager, fileOptions, null, null);

    before((next)=> {
        fileTokenHandler.setServer(server);
        ObjectPath.ensureExists(server, 'settings.app.services', {});
        server.settings.app.services.fileFactory = fileFactory;
        server.settings.app.services.fileManager = fileManager;
        next();
    });

    test('Handler - success', (next)=> {

        const stub = Sinon.stub(fileFactory, 'getInstance', () => {
            return fileHelper;
        });
        const stub2 = Sinon.stub(fileHelper, 'syncSrcToTemp', (callback)=> {
            callback();
        });

        const spy:any = Sinon.spy((json)=> {
            stub.restore();
            stub2.restore();
            expect(spy.called).to.true();
            expect(json.token).to.be.exist();
            next();
        });
        const result = fileTokenHandler.handlerInit(request, options);
        result(request, spy);
    });

    test('Handler - failure', (next)=> {

        const stub = Sinon.stub(fileFactory, 'getInstance', () => {
            return fileHelper;
        });
        const stub2 = Sinon.stub(fileHelper, 'syncSrcToTemp', (callback)=> {
            callback('error');
        });

        const spy:any = Sinon.spy((boom)=> {
            stub.restore();
            stub2.restore();
            expect(spy.called).to.true();
            expect(boom.token).not.to.be.exist();
            next();
        });
        const result = fileTokenHandler.handlerInit(request, options);
        result(request, spy);
    });

    test('Handler - success - remove token', (next)=> {

        delete options.tokenPath;

        const stub = Sinon.stub(fileFactory, 'getInstance', () => {
            return fileHelper;
        });
        const stub2 = Sinon.stub(fileHelper, 'syncSrcToTemp', (callback)=> {
            callback();
        });

        const spy:any = Sinon.spy((json)=> {
            stub.restore();
            stub2.restore();
            expect(spy.called).to.true();
            expect(json.token).to.be.exist();
            next();
        });
        const request:any = {};
        const result = fileTokenHandler.handlerInit(request, options);
        result(request, spy);
    });


});