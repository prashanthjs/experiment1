var Code = require('code');
var Lab = require('lab');
var Sinon = require('sinon');
var Fs = require('fs-plus');
var FileManager = require('../../services/file.manager');
var FileHelper = require('../../services/file.helper');
var lab = exports.lab = Lab.script(), before = lab.before, beforeEach = lab.beforeEach, afterEach = lab.afterEach, after = lab.after, expect = Code.expect, suite = lab.suite, test = lab.test;
suite('Test File upload', function () {
    var fileManager = new FileManager.default();
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
    var token = '123456';
    var ext = 'ext1234';
    var fileHelper = new FileHelper.default(fileManager, options, ext, token);
    test('test Get Source Directory', function (next) {
        expect(fileHelper.getSrcDir()).to.be.equal('src/' + ext);
        next();
    });
    test('test Get Temp Directory', function (next) {
        expect(fileHelper.getTempDir()).to.be.equal('temp/' + token);
        next();
    });
    test('test Sync Src to temp', function (next) {
        var stub = Sinon.stub(fileManager, 'syncFiles', function (srcDir, tempDir) {
            expect(srcDir).to.be.equal('src/' + ext);
            expect(tempDir).to.be.equal('temp/' + token);
        });
        var stub1 = Sinon.stub(fileManager, 'removeSyncSubDir', function (tempDir) {
            expect(tempDir).to.be.equal('temp/' + token);
        });
        var spy = Sinon.spy(function () {
            stub1.restore();
            stub.restore();
            expect(spy.called).to.be.true();
            next();
        });
        fileHelper.syncSrcToTemp(spy);
    });
    test('test Sync Src to temp with no ext path', function (next) {
        var ext = null;
        var fileHelper = new FileHelper.default(fileManager, options, ext, token);
        var stub = Sinon.stub(Fs, 'makeTreeSync', function (tempDir) {
            expect(tempDir).to.be.equal('temp/' + token);
        });
        var spy = Sinon.spy(function () {
            stub.restore();
            expect(spy.called).to.be.true();
            next();
        });
        fileHelper.syncSrcToTemp(spy);
    });
    test('test Sync temp to src', function (next) {
        var stub = Sinon.stub(fileManager, 'syncFiles', function (tempDir, srcDir) {
            expect(srcDir).to.be.equal('src/' + ext);
            expect(tempDir).to.be.equal('temp/' + token);
        });
        var stub1 = Sinon.stub(fileManager, 'removeSyncSubDir', function (srcDir) {
            expect(srcDir).to.be.equal('src/' + ext);
        });
        var stub2 = Sinon.stub(fileManager, 'createThumbnails', function (srcDir, thumbnails, next) {
            expect(srcDir).to.be.equal('src/' + ext);
            expect(thumbnails).to.deep.equal(options.thumbnails);
            next();
        });
        var spy = Sinon.spy(function () {
            stub1.restore();
            stub.restore();
            stub2.restore();
            expect(spy.called).to.be.true();
            next();
        });
        fileHelper.syncTempToSrc(spy);
    });
    test('test has valid extension', function (next) {
        var result = fileHelper.hasValidExtension('file.jpg');
        expect(result).to.be.true();
        result = fileHelper.hasValidExtension('file.exe');
        expect(result).to.be.false();
        next();
    });
    test('test has valid extension with no validation extensions', function (next) {
        var options = {
            tempDir: 'temp',
            srcDir: 'src',
            minUpload: 1,
            maxUpload: 3
        };
        var fileHelper = new FileHelper.default(fileManager, options, ext, token);
        var result = fileHelper.hasValidExtension('file.exe');
        expect(result).to.be.true();
        next();
    });
    test('test has valid upload limit', function (next) {
        var stub = Sinon.stub(fileManager, 'getOnlyFiles', function (tempDir) {
            expect(tempDir).to.be.equal('temp/' + token);
            return ['temp1.jpg'];
        });
        var result = fileHelper.hasValidUploadLimit();
        expect(result).to.be.true();
        stub.restore();
        stub = Sinon.stub(fileManager, 'getOnlyFiles', function (tempDir) {
            expect(tempDir).to.be.equal('temp/' + token);
            return ['temp1.jpg', 'temp2.jpg', 'temp3.jpg'];
        });
        result = fileHelper.hasValidUploadLimit();
        expect(result).to.be.false();
        stub.restore();
        next();
    });
    test('test can upload', function (next) {
        var stub = Sinon.stub(fileManager, 'getOnlyFiles', function (tempDir) {
            expect(tempDir).to.be.equal('temp/' + token);
            return ['temp1.jpg'];
        });
        var result = fileHelper.canUpload('file1.jpg');
        expect(result).to.be.true();
        stub.restore();
        result = fileHelper.canUpload('file1.pdf');
        expect(result).to.be.false();
        stub = Sinon.stub(fileManager, 'getOnlyFiles', function (tempDir) {
            expect(tempDir).to.be.equal('temp/' + token);
            return ['temp1.jpg', 'temp2.jpg', 'temp3.jpg'];
        });
        result = fileHelper.canUpload('file1.jpg');
        expect(result).to.be.false();
        stub.restore();
        next();
    });
    test('test has valid range', function (next) {
        var stub = Sinon.stub(fileManager, 'getOnlyFiles', function (tempDir) {
            expect(tempDir).to.be.equal('temp/' + token);
            return ['temp1.jpg'];
        });
        var result = fileHelper.hasValidUploadSaveRange();
        expect(result).to.be.true();
        stub.restore();
        stub = Sinon.stub(fileManager, 'getOnlyFiles', function (tempDir) {
            expect(tempDir).to.be.equal('temp/' + token);
            return ['temp1.jpg', 'temp2.jpg', 'temp3.jpg'];
        });
        result = fileHelper.hasValidUploadSaveRange();
        expect(result).to.be.true();
        stub.restore();
        stub = Sinon.stub(fileManager, 'getOnlyFiles', function (tempDir) {
            expect(tempDir).to.be.equal('temp/' + token);
            return [];
        });
        result = fileHelper.hasValidUploadSaveRange();
        expect(result).to.be.false();
        stub.restore();
        stub = Sinon.stub(fileManager, 'getOnlyFiles', function (tempDir) {
            expect(tempDir).to.be.equal('temp/' + token);
            return ['temp1.jpg', 'temp2.jpg', 'temp3.jpg', 'temp4.jpg'];
        });
        result = fileHelper.hasValidUploadSaveRange();
        expect(result).to.be.false();
        stub.restore();
        next();
    });
    test('test has valid files', function (next) {
        var stub = Sinon.stub(fileManager, 'getOnlyFiles', function (tempDir) {
            expect(tempDir).to.be.equal('temp/' + token);
            return ['temp1.jpg'];
        });
        var result = fileHelper.hasValidFiles();
        expect(result).to.be.true();
        stub.restore();
        stub = Sinon.stub(fileManager, 'getOnlyFiles', function (tempDir) {
            expect(tempDir).to.be.equal('temp/' + token);
            return ['temp1.pdf'];
        });
        result = fileHelper.hasValidFiles();
        expect(result).to.be.false();
        stub.restore();
        next();
    });
    test('test has valid files', function (next) {
        var stub = Sinon.stub(fileManager, 'getOnlyFiles', function (tempDir) {
            expect(tempDir).to.be.equal('temp/' + token);
            return ['temp1.jpg'];
        });
        var result = fileHelper.canSave();
        expect(result).to.be.true();
        stub.restore();
        stub = Sinon.stub(fileManager, 'getOnlyFiles', function (tempDir) {
            expect(tempDir).to.be.equal('temp/' + token);
            return ['temp1.pdf'];
        });
        result = fileHelper.canSave();
        expect(result).to.be.false();
        stub.restore();
        stub = Sinon.stub(fileManager, 'getOnlyFiles', function (tempDir) {
            expect(tempDir).to.be.equal('temp/' + token);
            return ['temp1.jpg', 'temp2.jpg', 'temp3.jpg', 'temp4.jpg'];
        });
        result = fileHelper.canSave();
        expect(result).to.be.false();
        stub.restore();
        next();
    });
    test('test get src files', function (next) {
        var stub = Sinon.stub(fileManager, 'getOnlyFiles', function (srcDir) {
            expect(srcDir).to.be.equal('src/' + ext);
            return ['temp1.jpg'];
        });
        fileHelper.getSrcFiles();
        stub.restore();
        next();
    });
    test('test get temp files', function (next) {
        var stub = Sinon.stub(fileManager, 'getOnlyFiles', function (tempDir) {
            expect(tempDir).to.be.equal('temp/' + token);
            return ['temp1.jpg'];
        });
        fileHelper.getTempFiles();
        stub.restore();
        next();
    });
    test('test get temp files', function (next) {
        var stub = Sinon.stub(fileManager, 'getOnlyFiles', function (srcDir) {
            expect(srcDir).to.be.equal('src/' + ext + '/test');
            return ['temp1.jpg'];
        });
        fileHelper.getExtFiles('test');
        stub.restore();
        next();
    });
    suite('Test file upload', function () {
        test('test upload', function (next) {
            var file = 'test';
            var fileName = 'test.jpg';
            var stub = Sinon.stub(fileManager, 'getOnlyFiles', function (tempDir) {
                expect(tempDir).to.be.equal('temp/' + token);
                return ['temp1.jpg'];
            });
            var stub1 = Sinon.stub(fileManager, 'upload', function (targetFile, targetFileName, tempDir, callback) {
                expect(tempDir).to.be.equal('temp/' + token);
                expect(targetFile).to.be.equal(file);
                expect(targetFileName).to.be.equal(fileName);
                callback();
            });
            var spy = Sinon.spy(function (error) {
                expect(error).to.be.undefined();
                stub.restore();
                stub1.restore();
                expect(spy.called).to.be.true();
                next();
            });
            fileHelper.upload(file, fileName, spy);
        });
        test('test upload - not a valid file', function (next) {
            var file = 'test';
            var fileName = 'test.exe';
            var stub = Sinon.stub(fileManager, 'getOnlyFiles', function (tempDir) {
                expect(tempDir).to.be.equal('temp/' + token);
                return ['temp1.jpg'];
            });
            var stub1 = Sinon.stub(fileManager, 'upload', function (targetFile, targetFileName, tempDir, callback) {
                expect(tempDir).to.be.equal('temp/' + token);
                expect(targetFile).to.be.equal(file);
                expect(targetFileName).to.be.equal(fileName);
                callback();
            });
            var spy = Sinon.spy(function (error) {
                expect(error).to.be.exist();
                stub.restore();
                stub1.restore();
                expect(spy.called).to.be.true();
                next();
            });
            fileHelper.upload(file, fileName, spy);
        });
        test('test upload - exceeded the limit', function (next) {
            var file = 'test';
            var fileName = 'test.jpg';
            var stub = Sinon.stub(fileManager, 'getOnlyFiles', function (tempDir) {
                expect(tempDir).to.be.equal('temp/' + token);
                return ['temp1.jpg', 'temp2.jpg', 'temp3.jpg', 'temp4.jpg'];
            });
            var stub1 = Sinon.stub(fileManager, 'upload', function (targetFile, targetFileName, tempDir, callback) {
                expect(tempDir).to.be.equal('temp/' + token);
                expect(targetFile).to.be.equal(file);
                expect(targetFileName).to.be.equal(fileName);
                callback();
            });
            var spy = Sinon.spy(function (error) {
                expect(error).to.be.exist();
                stub.restore();
                stub1.restore();
                expect(spy.called).to.be.true();
                next();
            });
            fileHelper.upload(file, fileName, spy);
        });
    });
    test('test upload - remove file', function (next) {
        var fileName = 'test.jpg';
        var stub = Sinon.stub(fileManager, 'removeFile', function (file) {
            expect(file).to.be.equal('temp/' + token + '/' + fileName);
        });
        var stub1 = Sinon.stub(Fs, 'isFileSync', function (file) {
            expect(file).to.be.equal('temp/' + token + '/' + fileName);
            return true;
        });
        fileHelper.removeFile(fileName);
        stub.restore();
        stub1.restore();
        next();
    });
    test('test upload - remove file - not a file', function (next) {
        var fileName = 'test.jpg';
        var stub = Sinon.stub(Fs, 'isFileSync', function (file) {
            expect(file).to.be.equal('temp/' + token + '/' + fileName);
            return false;
        });
        fileHelper.removeFile(fileName);
        stub.restore();
        next();
    });
});
