"use strict";
var Hapi = require('hapi');
var Code = require('code');
var Lab = require('lab');
var FileManager = require('../../services/file.manager');
var FileHelper = require('../../services/file.helper');
var FileFactory = require('../../services/file.factory');
var lab = exports.lab = Lab.script(), before = lab.before, beforeEach = lab.beforeEach, afterEach = lab.afterEach, after = lab.after, expect = Code.expect, suite = lab.suite, test = lab.test;
suite('Test File upload', function () {
    var server = new Hapi.Server();
    server.settings.app = {
        services: {
            'fileManager': new FileManager.default()
        }
    };
    var options = {
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
    var fileFactory = new FileFactory.default();
    fileFactory.setServer(server);
    test('test get instance', function (next) {
        var fileHelper = fileFactory.getInstance(options, 'test', 'token');
        expect(fileHelper).to.be.instanceOf(FileHelper.default);
        next();
    });
    test('test get file manager', function (next) {
        var fileManager = fileFactory.getFileManager();
        expect(fileManager).to.be.instanceOf(FileManager.default);
        next();
    });
});
