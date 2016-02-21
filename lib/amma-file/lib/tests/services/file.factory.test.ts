import Hapi = require('hapi');
import Code = require('code');
import Lab = require('lab');
import Sinon = require('sinon');
import Path = require('path');
import Fs = require('fs-plus');
import FileManager = require('../../services/file.manager');
import FileHelper = require('../../services/file.helper');
import FileFactory = require('../../services/file.factory');

const lab = exports.lab = Lab.script(),
    before = lab.before,
    beforeEach = lab.beforeEach,
    afterEach = lab.afterEach,
    after = lab.after,
    expect = Code.expect,
    suite = lab.suite,
    test = lab.test;

suite('Test File upload', () => {
    const server = new Hapi.Server();
    server.plugins = {
        'amma-file': {
            'fileManager': new FileManager.default()
        }
    };
    const options = {
        tempDir: 'temp',
        srcDir: 'src',
        thumbnails: [{
            'name': 'thumbnail',
            'width': 200,
            'height': 200,
            quality: 100
        }],
        validExtensions: ['.jpg', '.png'],
        minUpload: 1,
        maxUpload: 3
    };
    const fileFactory = new FileFactory.default();
    fileFactory.setServer(server);
    test('test get instance', (next) => {
        const fileHelper = fileFactory.getInstance(options, 'test', 'token');
        expect(fileHelper).to.be.instanceOf(FileHelper.default);
        next();
    });

    test('test get file manager', (next) => {
        const fileManager = fileFactory.getFileManager();
        expect(fileManager).to.be.instanceOf(FileManager.default);
        next();
    });


});
