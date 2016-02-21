import Hapi = require('hapi');
import Code = require('code');
import Lab = require('lab');
import Sinon = require('sinon');
import Joi = require('joi');
import ObjectPath = require('object-path');
import FileManager = require('../../services/file.manager');
import FileHelper = require('../../services/file.helper');
import FileFactory = require( "../../services/file.factory");
import FileGetHandler = require( "../../handlers/file.get.handler");
import TestData = require('./data/test-data');

const lab = exports.lab = Lab.script(),
    before = lab.before,
    beforeEach = lab.beforeEach,
    afterEach = lab.afterEach,
    after = lab.after,
    expect = Code.expect,
    suite = lab.suite,
    test = lab.test;

suite('File Get Handler', () => {

    const server = new Hapi.Server();
    const fileGetHandler = new FileGetHandler.default();
    const fileFactory = new FileFactory.default();
    const fileManager = new FileManager.default();
    const fileOptions = TestData.default.fileOptions;
    const options = TestData.default.options;
    const request:any = TestData.default.request;
    const fileHelper = new FileHelper.default(fileManager, fileOptions, null, null);

    before((next)=> {
        fileGetHandler.setServer(server);
        server.plugins = {
            'amma-file': {
                fileFactory: fileFactory,
                fileManager: fileManager,
            }
        };
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
        const files = ['test1.jpg'];
        const stub = Sinon.stub(fileHelper, 'getSrcFiles', ()=> {
            return files;
        });
        const spy:any = Sinon.spy((fls)=> {
            stub.restore();
            expect(spy.called).to.true();
            expect(fls).to.deep.equal({files: files});
            next();
        });
        const result = fileGetHandler.handlerInit(request, options);
        result(request, spy);
    });
    afterEach((next)=> {
        stub.restore();
        next();
    });
});