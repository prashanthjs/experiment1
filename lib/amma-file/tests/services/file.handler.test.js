var Hapi = require('hapi');
var Code = require('code');
var Lab = require('lab');
var Sinon = require('sinon');
var FileManager = require('../../services/file.manager');
var FileHelper = require('../../services/file.helper');
var FileHandler = require('../../services/file.handler');
var FileFactory = require("../../services/file.factory");
var lab = exports.lab = Lab.script(), before = lab.before, beforeEach = lab.beforeEach, afterEach = lab.afterEach, after = lab.after, expect = Code.expect, suite = lab.suite, test = lab.test;
suite('File Handler', function () {
    var server = new Hapi.Server();
    var fileFactory = new FileFactory.default();
    var fileManager = new FileManager.default();
    var fileHandler = new FileHandler.default();
    var type = 'product';
    var options = {
        tempDir: 'temp',
        srcDir: 'src',
        thumbnails: [{
                'name': 'thumbnail',
                'width': 200,
                'height': 200,
                quality: 100
            }],
        minUpload: 1,
        maxUpload: 3
    };
    before(function (next) {
        server.plugins = {
            'amma-file': {
                'fileFactory': fileFactory,
                fileManager: fileManager
            }
        };
        server.settings.app = {
            file: {
                product: options
            }
        };
        fileHandler.setServer(server);
        next();
    });
    suite('create token', function () {
        var extPath = 'test';
        var token = 'token';
        var fileHelper = new FileHelper.default(fileManager, options, extPath, token);
        var request = {
            params: {
                token: token,
                extPath: extPath,
                type: 'product'
            }
        };
        test('create token - success', function (next) {
            var stub = Sinon.stub(fileFactory, 'getInstance', function () {
                return fileHelper;
            });
            var stub2 = Sinon.stub(fileHelper, 'syncSrcToTemp', function (callback) {
                callback();
            });
            var spy = Sinon.spy(function (json) {
                stub.restore();
                stub2.restore();
                expect(spy.called).to.true();
                expect(json.token).to.be.exist();
                next();
            });
            fileHandler.createToken(request, spy);
        });
        test('create token - fail', function (next) {
            var stub = Sinon.stub(fileFactory, 'getInstance', function () {
                return fileHelper;
            });
            var stub2 = Sinon.stub(fileHelper, 'syncSrcToTemp', function (callback) {
                callback('error');
            });
            var spy = Sinon.spy(function (boom) {
                stub.restore();
                stub2.restore();
                expect(spy.called).to.true();
                expect(boom.token).not.to.be.exist();
                next();
            });
            fileHandler.createToken(request, spy);
        });
    });
    suite('Get files', function () {
        var extPath = 'test';
        var token = 'token';
        var fileHelper = new FileHelper.default(fileManager, options, extPath, token);
        var stub;
        beforeEach(function (next) {
            stub = Sinon.stub(fileFactory, 'getInstance', function () {
                return fileHelper;
            });
            next();
        });
        test('get files', function (next) {
            var files = ['test1.jpg'];
            var request = {
                params: {
                    extPath: extPath,
                    type: 'product'
                }
            };
            var stub = Sinon.stub(fileHelper, 'getSrcFiles', function () {
                return files;
            });
            var spy = Sinon.spy(function (fls) {
                stub.restore();
                expect(spy.called).to.true();
                expect(fls).to.only.include({ files: files });
                next();
            });
            fileHandler.getFiles(request, spy);
        });
        test('get Temp files', function (next) {
            var files = ['test1.jpg'];
            var request = {
                params: {
                    extPath: extPath,
                    token: token,
                    type: type
                }
            };
            var stub = Sinon.stub(fileHelper, 'getTempFiles', function () {
                return files;
            });
            var spy = Sinon.spy(function (fls) {
                stub.restore();
                expect(spy.called).to.true();
                expect(fls).to.only.include({ files: files });
                next();
            });
            fileHandler.getTempFiles(request, spy);
        });
        test('get Additional files', function (next) {
            var files = ['test1.jpg'];
            var request = {
                params: {
                    extPath: extPath,
                    type: type,
                    additionalPath: 'additionalPath'
                }
            };
            var stub = Sinon.stub(fileHelper, 'getExtFiles', function (additionalPath) {
                expect(additionalPath).to.be.equal('additionalPath');
                return files;
            });
            var spy = Sinon.spy(function (fls) {
                stub.restore();
                expect(spy.called).to.true();
                expect(fls).to.only.include({ files: files });
                next();
            });
            fileHandler.getFilesWithAdditionalPath(request, spy);
        });
        afterEach(function (next) {
            stub.restore();
            next();
        });
    });
    suite('Upload files', function () {
        var extPath = 'test';
        var token = 'token';
        var fileHelper = new FileHelper.default(fileManager, options, extPath, token);
        var request = {
            params: {
                extPath: extPath,
                token: token,
                type: type
            },
            payload: {
                file: {
                    hapi: {
                        filename: 'test1.jpg',
                        headers: {
                            'test': '200kb'
                        }
                    }
                }
            }
        };
        var stub;
        beforeEach(function (next) {
            stub = Sinon.stub(fileFactory, 'getInstance', function () {
                return fileHelper;
            });
            next();
        });
        test('upload - success', function (next) {
            var stub = Sinon.stub(fileHelper, 'upload', function (file, fileName, callback) {
                expect(fileName).to.be.equal(request.payload.file.hapi.filename);
                expect(file).to.only.include(request.payload.file);
                callback(null, {
                    filename: request.payload.file.hapi.filename
                });
            });
            var spy = Sinon.spy(function (result) {
                stub.restore();
                expect(spy.called).to.true();
                expect(result.filename).to.be.equal(request.payload.file.hapi.filename);
                expect(result.headers).to.only.include(request.payload.file.hapi.headers);
                next();
            });
            fileHandler.upload(request, spy);
        });
        test('upload - fail', function (next) {
            var stub = Sinon.stub(fileHelper, 'upload', function (file, fileName, callback) {
                expect(fileName).to.be.equal(request.payload.file.hapi.filename);
                expect(file).to.only.include(request.payload.file);
                callback('error');
            });
            var spy = Sinon.spy(function (result) {
                stub.restore();
                expect(spy.called).to.true();
                expect(result.filename).not.to.be.exist();
                next();
            });
            fileHandler.upload(request, spy);
        });
        afterEach(function (next) {
            stub.restore();
            next();
        });
    });
    suite('Save', function () {
        var extPath = 'test';
        var token = 'token';
        var fileHelper = new FileHelper.default(fileManager, options, extPath, token);
        var request = {
            params: {
                extPath: extPath,
                token: token,
                type: type
            },
            payload: {
                file: {
                    hapi: {
                        filename: 'test1.jpg',
                        headers: {
                            'test': '200kb'
                        }
                    }
                }
            }
        };
        var stub;
        beforeEach(function (next) {
            stub = Sinon.stub(fileFactory, 'getInstance', function () {
                return fileHelper;
            });
            next();
        });
        test('save - success', function (next) {
            var stub = Sinon.stub(fileHelper, 'syncSrcToTemp', function (callback) {
                callback();
            });
            var spy = Sinon.spy(function (result) {
                stub.restore();
                expect(spy.called).to.true();
                expect(result.success).to.be.true();
                next();
            });
            fileHandler.save(request, spy);
        });
        test('save - fail', function (next) {
            var stub = Sinon.stub(fileHelper, 'syncSrcToTemp', function (callback) {
                callback('error');
            });
            var spy = Sinon.spy(function (result) {
                stub.restore();
                expect(spy.called).to.true();
                expect(result.success).not.to.be.exist();
                next();
            });
            fileHandler.save(request, spy);
        });
        afterEach(function (next) {
            stub.restore();
            next();
        });
    });
    suite('Delete', function () {
        var extPath = 'test';
        var token = 'token';
        var fileHelper = new FileHelper.default(fileManager, options, extPath, token);
        var request = {
            params: {
                extPath: extPath,
                token: token,
                type: type,
                fileName: 'test1.jpg'
            }
        };
        var stub;
        beforeEach(function (next) {
            stub = Sinon.stub(fileFactory, 'getInstance', function () {
                return fileHelper;
            });
            next();
        });
        test('delete - success', function (next) {
            var stub = Sinon.stub(fileHelper, 'removeFile', function (fileName) {
                expect(fileName).to.be.equal('test1.jpg');
            });
            var spy = Sinon.spy(function (result) {
                stub.restore();
                expect(spy.called).to.true();
                expect(result.success).to.be.true();
                next();
            });
            fileHandler.removeFile(request, spy);
        });
        afterEach(function (next) {
            stub.restore();
            next();
        });
    });
});
