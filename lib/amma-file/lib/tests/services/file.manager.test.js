var Code = require('code');
var Lab = require('lab');
var Sinon = require('sinon');
var Fs = require('fs-plus');
var FileManager = require('../../services/file.manager');
var Gm = require('gm');
var lab = exports.lab = Lab.script(), before = lab.before, beforeEach = lab.beforeEach, afterEach = lab.afterEach, after = lab.after, expect = Code.expect, suite = lab.suite, test = lab.test;
suite('Test File upload', function () {
    var fileManager;
    before(function (next) {
        fileManager = new FileManager.default();
        return next();
    });
    test('create token', function (next) {
        var token = fileManager.createToken();
        expect(token).not.to.be.an.empty();
        next();
    });
    test('Top level files', function (next) {
        var testPath = '/test';
        var stub = Sinon.stub(Fs, 'listSync', function (path, extensions) {
            expect(path).to.be.equal(testPath);
            return ['test1'];
        });
        var stub2 = Sinon.stub(Fs, 'isDirectorySync', function (path) {
            return true;
        });
        var files = fileManager.getTopLevelFiles(testPath);
        expect(files).to.be.an.array();
        expect(files).to.deep.equal(['test1']);
        stub.restore();
        stub2.restore();
        next();
    });
    test('Top level files - empty', function (next) {
        var testPath = '/test';
        var stub = Sinon.stub(Fs, 'listSync', function (path, extensions) {
            expect(path).to.be.equal(testPath);
            return [];
        });
        var stub2 = Sinon.stub(Fs, 'isDirectorySync', function (path) {
            return true;
        });
        var files = fileManager.getTopLevelFiles(testPath);
        expect(files).to.deep.equal([]);
        stub.restore();
        stub2.restore();
        next();
    });
    test('Get only files', function (next) {
        var returnFiles = ['dir', 'file'];
        var stub = Sinon.stub(Fs, 'listSync', function (path, extensions) {
            return returnFiles;
        });
        var stub1 = Sinon.stub(Fs, 'isFileSync', function (file) {
            if (file === 'file') {
                return true;
            }
            return false;
        });
        var stub2 = Sinon.stub(Fs, 'isDirectorySync', function (path) {
            return true;
        });
        var files = fileManager.getOnlyFiles('');
        expect(files).to.be.an.array();
        expect(files).to.only.include(['file']);
        stub.restore();
        stub1.restore();
        stub2.restore();
        next();
    });
    test('Remove Sync sub dir', function (next) {
        var returnFiles = ['dir', 'file'];
        var stub = Sinon.stub(Fs, 'listSync', function (path, extensions) {
            return returnFiles;
        });
        var stub1 = Sinon.stub(Fs, 'isDirectorySync', function (file) {
            if (file === 'dir') {
                return true;
            }
            return false;
        });
        var stub2 = Sinon.stub(Fs, 'removeSync', function (path) {
            expect(path).to.be.equal('dir');
        });
        fileManager.removeSyncSubDir('dir');
        stub.restore();
        stub1.restore();
        stub2.restore();
        next();
    });
    test('Sync files', function (next) {
        var srcDir = 'srcDir';
        var targetDir = 'targetDir';
        var stub = Sinon.stub(Fs, 'makeTreeSync', function (path) {
            expect(path).to.be.equal(targetDir);
        });
        var stub1 = Sinon.stub(Fs, 'copySync', function (src, target) {
            expect(src).to.be.equal(srcDir);
            expect(target).to.be.equal(targetDir);
        });
        var stub2 = Sinon.stub(Fs, 'removeSync', function (path) {
            expect(path).to.be.equal(targetDir);
        });
        var stub3 = Sinon.stub(Fs, 'isDirectorySync', function (file) {
            return true;
        });
        fileManager.syncFiles(srcDir, targetDir);
        stub.restore();
        stub1.restore();
        stub2.restore();
        stub3.restore();
        next();
    });
    test('Sync files - directory does not exist', function (next) {
        var srcDir = 'srcDir';
        var targetDir = 'targetDir';
        var stub = Sinon.stub(Fs, 'makeTreeSync', function (path) {
            expect(path).to.be.equal(targetDir);
        });
        var stub2 = Sinon.stub(Fs, 'removeSync', function (path) {
            expect(path).to.be.equal(targetDir);
        });
        var stub3 = Sinon.stub(Fs, 'isDirectorySync', function (file) {
            return false;
        });
        fileManager.syncFiles(srcDir, targetDir);
        stub.restore();
        stub2.restore();
        stub3.restore();
        next();
    });
    test('get unique file names', function (next) {
        var i = 0;
        var stub = Sinon.stub(Fs, 'isFileSync', function (path) {
            if (path === 'file.jpg') {
                if (!i) {
                    i = 1;
                    return false;
                }
                return true;
            }
            return false;
        });
        var filename = fileManager.getUniqueFileName('file.jpg');
        expect(filename).to.be.equal('file.jpg');
        filename = fileManager.getUniqueFileName('file.jpg');
        expect(filename).to.be.equal('file_1.jpg');
        stub.restore();
        next();
    });
    test('Create Thumbnail', function (next) {
        var gm = Gm;
        var stub = Sinon.stub(Fs, 'isImageExtension', function (path) {
            return true;
        });
        var stub2 = Sinon.stub(Fs, 'makeTreeSync', function (path) {
            return true;
        });
        var thumbnail = {
            name: 'test',
            width: 100,
            height: 100,
            quality: 100
        };
        var targetDir = 'target';
        var filename = 'file.jpg';
        var spy = Sinon.spy(function () {
            expect(spy.called).to.be.true();
            stub.restore();
            stub2.restore();
            Gm = gm;
            next();
        });
        var thumbSpy = Sinon.spy(function (width, height, thumbnailPath, quality, done) {
            expect(width).to.be.equal(thumbnail.width);
            expect(height).to.be.equal(thumbnail.height);
            expect(height).to.be.equal(thumbnail.quality);
            expect(thumbnailPath).to.be.equal(targetDir + '/' + thumbnail.name + '/' + filename);
            done();
        });
        var spy1 = Sinon.spy(function (file) {
            expect(file).to.be.equal('file.jpg');
            return {
                thumb: thumbSpy
            };
        });
        Gm = spy1;
        fileManager.createThumbnail(filename, targetDir, thumbnail, spy);
    });
    test('Create Thumbnail - not an image', function (next) {
        var gm = Gm;
        var stub = Sinon.stub(Fs, 'isImageExtension', function (path) {
            return false;
        });
        var thumbnail = {
            name: 'test',
            width: 100,
            height: 100,
            quality: 100
        };
        var targetDir = 'target';
        var filename = 'file.jpg';
        var spy = Sinon.spy(function () {
            expect(spy.called).to.be.true();
            stub.restore();
            next();
        });
        fileManager.createThumbnail(filename, targetDir, thumbnail, spy);
    });
    test('Create Thumbnail  - callback is called immediately if not an image ', function (next) {
        var thumbnail = {
            name: 'test',
            width: 100,
            height: 100,
            quality: 100
        };
        var targetDir = 'target';
        var filename = 'file.jpg';
        var stub = Sinon.stub(Fs, 'isImageExtension', function (path) {
            return false;
        });
        var spy = Sinon.spy(function () {
            expect(spy.called).to.be.true();
            stub.restore();
            next();
        });
        fileManager.createThumbnail(filename, targetDir, thumbnail, spy);
    });
    test('Create Thumbnails', function (next) {
        var thumbnail = {
            name: 'test',
            width: 100,
            height: 100,
            quality: 100
        };
        var thumbnails = [thumbnail];
        var filename = 'file.jpg';
        var stub = Sinon.stub(fileManager, 'getOnlyFiles', function (path) {
            return [filename];
        });
        var stub2 = Sinon.stub(fileManager, 'createThumbnail', function (file, targetPath, thumbnail, next) {
            next();
        });
        var spy = Sinon.spy(function () {
            expect(spy.called).to.be.true();
            stub.restore();
            stub2.restore();
            next();
        });
        fileManager.createThumbnails(filename, thumbnails, spy);
    });
    test('Create Thumbnails - empty array', function (next) {
        var thumbnail = {
            name: 'test',
            width: 100,
            height: 100,
            quality: 100
        };
        var thumbnails = [thumbnail];
        var stub = Sinon.stub(fileManager, 'getOnlyFiles', function (path) {
            return [];
        });
        var spy = Sinon.spy(function () {
            expect(spy.called).to.be.true();
            stub.restore();
            next();
        });
        fileManager.createThumbnails('path', thumbnails, spy);
    });
    suite('Test file upload', function () {
        var mockFilesDir = __dirname + '/test-files';
        test('test upload', function (next) {
            var sinon = Sinon.spy(function (error) {
                expect(error).to.be.undefined();
                expect(sinon.called).to.be.true();
                next();
            });
            var readableStream = Fs.createReadStream(mockFilesDir + '/src/test1.txt');
            fileManager.upload(readableStream, 'test2.txt', mockFilesDir + '/target', sinon);
        });
        after(function (next) {
            Fs.removeSync(mockFilesDir + '/target/test2.txt');
            next();
        });
    });
});
