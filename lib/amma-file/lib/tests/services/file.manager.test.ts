import Hapi = require('hapi');
import Code = require('code');
import Lab = require('lab');
import Sinon = require('sinon');
import Path = require('path');
import Fs = require('fs-plus');
import FileManager = require('../../services/file.manager');

let Gm = require('gm');
const lab = exports.lab = Lab.script(),
    before = lab.before,
    beforeEach = lab.beforeEach,
    afterEach = lab.afterEach,
    after = lab.after,
    expect = Code.expect,
    suite = lab.suite,
    test = lab.test;


suite('Test File upload', () => {
    let fileManager;
    before((next) => {
        fileManager = new FileManager.default();
        return next();
    });

    test('create token', (next) => {
        let token = fileManager.createToken();
        expect(token).not.to.be.an.empty();
        next();
    });

    test('Top level files', (next) => {
        let testPath = '/test';
        let stub = Sinon.stub(Fs, 'listSync', (path, extensions) => {
            expect(path).to.be.equal(testPath);
            return ['test1'];
        });
        let stub2 = Sinon.stub(Fs, 'isDirectorySync', (path) => {
            return true;
        });

        let files = fileManager.getTopLevelFiles(testPath);
        expect(files).to.be.an.array();
        expect(files).to.deep.equal(['test1']);
        stub.restore();
        stub2.restore();
        next();
    });
    test('Top level files - empty', (next) => {
        let testPath = '/test';
        let stub = Sinon.stub(Fs, 'listSync', (path, extensions) => {
            expect(path).to.be.equal(testPath);
            return [];
        });
        let stub2 = Sinon.stub(Fs, 'isDirectorySync', (path) => {
            return true;
        });

        let files = fileManager.getTopLevelFiles(testPath);
        expect(files).to.deep.equal([]);
        stub.restore();
        stub2.restore();
        next();
    });

    test('Get only files', (next) => {
        let returnFiles = ['dir', 'file'];

        let stub = Sinon.stub(Fs, 'listSync', (path, extensions) => {
            return returnFiles;
        });
        let stub1 = Sinon.stub(Fs, 'isFileSync', (file) => {
            if (file === 'file') {
                return true;
            }
            return false;
        });
        let stub2 = Sinon.stub(Fs, 'isDirectorySync', (path) => {
            return true;
        });
        let files = fileManager.getOnlyFiles('');
        expect(files).to.be.an.array();
        expect(files).to.only.include(['file']);
        stub.restore();
        stub1.restore();
        stub2.restore();
        next();
    });

    test('Remove Sync sub dir', (next) => {
        let returnFiles = ['dir', 'file'];
        let stub = Sinon.stub(Fs, 'listSync', (path, extensions) => {
            return returnFiles;
        });
        let stub1 = Sinon.stub(Fs, 'isDirectorySync', (file) => {
            if (file === 'dir') {
                return true;
            }
            return false;
        });

        let stub2 = Sinon.stub(Fs, 'removeSync', (path) => {
            expect(path).to.be.equal('dir');
        });
        fileManager.removeSyncSubDir('dir');
        stub.restore();
        stub1.restore();
        stub2.restore();
        next();
    });

    test('Sync files', (next) => {
        const srcDir = 'srcDir';
        const targetDir = 'targetDir';

        let stub = Sinon.stub(Fs, 'makeTreeSync', (path) => {
            expect(path).to.be.equal(targetDir);
        });
        let stub1 = Sinon.stub(Fs, 'copySync', (src, target) => {
            expect(src).to.be.equal(srcDir);
            expect(target).to.be.equal(targetDir);
        });
        let stub2 = Sinon.stub(Fs, 'removeSync', (path) => {
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

    test('Sync files - directory does not exist', (next) => {
        const srcDir = 'srcDir';
        const targetDir = 'targetDir';

        let stub = Sinon.stub(Fs, 'makeTreeSync', (path) => {
            expect(path).to.be.equal(targetDir);
        });

        let stub2 = Sinon.stub(Fs, 'removeSync', (path) => {
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

    test('get unique file names', (next) => {

        let i = 0;
        let stub = Sinon.stub(Fs, 'isFileSync', (path) => {
            if (path === 'file.jpg') {
                if (!i) {
                    i = 1;
                    return false;
                }
                return true;
            }
            return false;
        });
        let filename = fileManager.getUniqueFileName('file.jpg');
        expect(filename).to.be.equal('file.jpg');
        filename = fileManager.getUniqueFileName('file.jpg');
        expect(filename).to.be.equal('file_1.jpg');
        stub.restore();
        next();
    });

    test('Create Thumbnail', (next) => {

        let gm = Gm;
        let stub = Sinon.stub(Fs, 'isImageExtension', (path) => {
            return true;
        });
        let stub2 = Sinon.stub(Fs, 'makeTreeSync', (path) => {
            return true;
        });

        const thumbnail = {
            name: 'test',
            width: 100,
            height: 100,
            quality: 100
        };
        const targetDir = 'target';
        const filename = 'file.jpg';

        let spy = Sinon.spy(()=> {
            expect(spy.called).to.be.true();
            stub.restore();
            stub2.restore();
            Gm = gm;
            next();
        });
        let thumbSpy = Sinon.spy((width, height, thumbnailPath, quality, done)=> {
            expect(width).to.be.equal(thumbnail.width);
            expect(height).to.be.equal(thumbnail.height);
            expect(height).to.be.equal(thumbnail.quality);
            expect(thumbnailPath).to.be.equal(targetDir + '/' + thumbnail.name + '/' + filename);
            done();
        });
        let spy1 = Sinon.spy((file)=> {
            expect(file).to.be.equal('file.jpg');
            return {
                thumb: thumbSpy
            }
        });
        Gm = spy1;
        fileManager.createThumbnail(filename, targetDir, thumbnail, spy);

    });
    test('Create Thumbnail - not an image', (next) => {

        let gm = Gm;
        let stub = Sinon.stub(Fs, 'isImageExtension', (path) => {
            return false;
        });

        const thumbnail = {
            name: 'test',
            width: 100,
            height: 100,
            quality: 100
        };
        const targetDir = 'target';
        const filename = 'file.jpg';

        let spy = Sinon.spy(()=> {
            expect(spy.called).to.be.true();
            stub.restore();
            next();
        });
        fileManager.createThumbnail(filename, targetDir, thumbnail, spy);

    });
    test('Create Thumbnail  - callback is called immediately if not an image ', (next) => {
        const thumbnail = {
            name: 'test',
            width: 100,
            height: 100,
            quality: 100
        };
        const targetDir = 'target';
        const filename = 'file.jpg';

        let stub = Sinon.stub(Fs, 'isImageExtension', (path) => {
            return false;
        });
        let spy = Sinon.spy(()=> {
            expect(spy.called).to.be.true();
            stub.restore();
            next();
        });
        fileManager.createThumbnail(filename, targetDir, thumbnail, spy);
    });

    test('Create Thumbnails', (next) => {
        const thumbnail = {
            name: 'test',
            width: 100,
            height: 100,
            quality: 100
        };
        const thumbnails = [thumbnail];
        const filename = 'file.jpg';

        let stub = Sinon.stub(fileManager, 'getOnlyFiles', (path) => {
            return [filename];
        });
        let stub2 = Sinon.stub(fileManager, 'createThumbnail', (file, targetPath, thumbnail, next) => {
            next();
        });

        let spy = Sinon.spy(()=> {
            expect(spy.called).to.be.true();
            stub.restore();
            stub2.restore();
            next();
        });
        fileManager.createThumbnails(filename, thumbnails, spy);
    });

    test('Create Thumbnails - empty array', (next) => {
        const thumbnail = {
            name: 'test',
            width: 100,
            height: 100,
            quality: 100
        };
        const thumbnails = [thumbnail];
        let stub = Sinon.stub(fileManager, 'getOnlyFiles', (path) => {
            return [];
        });

        let spy = Sinon.spy(()=> {
            expect(spy.called).to.be.true();
            stub.restore();
            next();
        });
        fileManager.createThumbnails('path', thumbnails, spy);
    });

    suite('Test file upload', () => {

        const mockFilesDir = __dirname + '/test-files';
        test('test upload', (next) => {
            let sinon = Sinon.spy((error) => {
                expect(error).to.be.undefined();
                expect(sinon.called).to.be.true();
                next();
            });
            let readableStream = Fs.createReadStream(mockFilesDir + '/src/test1.txt');
            fileManager.upload(readableStream, 'test2.txt', mockFilesDir + '/target', sinon);
        });
        after((next) => {
            Fs.removeSync(mockFilesDir + '/target/test2.txt');
            next();
        });
    });
});