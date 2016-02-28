import Hapi = require('hapi');
import Code = require('code');
import Lab = require('lab');
import Sinon = require('sinon');
import Path = require('path');
import Fs = require('fs-plus');
import FileManager = require('../../services/file.manager');
import FileHelper = require('../../services/file.helper');

const lab = exports.lab = Lab.script(),
    before = lab.before,
    beforeEach = lab.beforeEach,
    afterEach = lab.afterEach,
    after = lab.after,
    expect = Code.expect,
    suite = lab.suite,
    test = lab.test;

suite('Test File upload', () => {
    const fileManager = new FileManager.default();
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
    const token = '123456';
    const ext = 'ext1234';
    const fileHelper = new FileHelper.default(fileManager, options, ext, token)

    test('test Get Source Directory', (next) => {
        expect(fileHelper.getSrcDir()).to.be.equal('src/' + ext);
        next();
    });

    test('test Get Temp Directory', (next) => {
        expect(fileHelper.getTempDir()).to.be.equal('temp/' + token);
        next();
    });

    test('test Sync Src to temp', (next) => {
        const stub = Sinon.stub(fileManager, 'syncFiles', (srcDir, tempDir)=> {
            expect(srcDir).to.be.equal('src/' + ext);
            expect(tempDir).to.be.equal('temp/' + token);
        });
        const stub1 = Sinon.stub(fileManager, 'removeSyncSubDir', (tempDir)=> {
            expect(tempDir).to.be.equal('temp/' + token);
        });

        const spy = Sinon.spy(()=> {
            stub1.restore();
            stub.restore();
            expect(spy.called).to.be.true();
            next();
        });
        fileHelper.syncSrcToTemp(spy);
    });
    test('test Sync Src to temp with no ext path', (next) => {
        const ext = null;
        const fileHelper = new FileHelper.default(fileManager, options, ext, token)
        const stub = Sinon.stub(Fs, 'makeTreeSync', (tempDir)=> {
            expect(tempDir).to.be.equal('temp/' + token);
        });
        const spy = Sinon.spy(()=> {
            stub.restore();
            expect(spy.called).to.be.true();
            next();
        });
        fileHelper.syncSrcToTemp(spy);
    });

    test('test Sync temp to src', (next) => {
        const stub = Sinon.stub(fileManager, 'syncFiles', (tempDir, srcDir)=> {
            expect(srcDir).to.be.equal('src/' + ext);
            expect(tempDir).to.be.equal('temp/' + token);
        });
        const stub1 = Sinon.stub(fileManager, 'removeSyncSubDir', (srcDir)=> {
            expect(srcDir).to.be.equal('src/' + ext);
        });
        const stub2 = Sinon.stub(fileManager, 'createThumbnails', (srcDir, thumbnails, next)=> {
            expect(srcDir).to.be.equal('src/' + ext);
            expect(thumbnails).to.deep.equal(options.thumbnails);
            next();
        });

        const spy = Sinon.spy(()=> {
            stub1.restore();
            stub.restore();
            stub2.restore();
            expect(spy.called).to.be.true();
            next();
        });
        fileHelper.syncTempToSrc(spy);
    });

    test('test has valid extension', (next) => {
        let result = fileHelper.hasValidExtension('file.jpg');
        expect(result).to.be.true();
        result = fileHelper.hasValidExtension('file.exe');
        expect(result).to.be.false();
        next();
    });

    test('test has valid extension with no validation extensions', (next) => {
        const options = {
            tempDir: 'temp',
            srcDir: 'src',
            minUpload: 1,
            maxUpload: 3
        };
        const fileHelper = new FileHelper.default(fileManager, options, ext, token)
        const result = fileHelper.hasValidExtension('file.exe');
        expect(result).to.be.true();
        next();
    });

    test('test has valid upload limit', (next) => {
        let stub = Sinon.stub(fileManager, 'getOnlyFiles', (tempDir)=> {
            expect(tempDir).to.be.equal('temp/' + token);
            return ['temp1.jpg'];
        });
        let result = fileHelper.hasValidUploadLimit();
        expect(result).to.be.true();
        stub.restore();
        stub = Sinon.stub(fileManager, 'getOnlyFiles', (tempDir)=> {
            expect(tempDir).to.be.equal('temp/' + token);
            return ['temp1.jpg', 'temp2.jpg', 'temp3.jpg'];
        });
        result = fileHelper.hasValidUploadLimit();
        expect(result).to.be.false();
        stub.restore();
        next();
    });

    test('test can upload', (next) => {
        let stub = Sinon.stub(fileManager, 'getOnlyFiles', (tempDir)=> {
            expect(tempDir).to.be.equal('temp/' + token);
            return ['temp1.jpg'];
        });
        let result = fileHelper.canUpload('file1.jpg');
        expect(result).to.be.true();
        stub.restore();
        result = fileHelper.canUpload('file1.pdf');
        expect(result).to.be.false();
        stub = Sinon.stub(fileManager, 'getOnlyFiles', (tempDir)=> {
            expect(tempDir).to.be.equal('temp/' + token);
            return ['temp1.jpg', 'temp2.jpg', 'temp3.jpg'];
        });
        result = fileHelper.canUpload('file1.jpg');
        expect(result).to.be.false();
        stub.restore();
        next();
    });

    test('test has valid range', (next) => {
        let stub = Sinon.stub(fileManager, 'getOnlyFiles', (tempDir)=> {
            expect(tempDir).to.be.equal('temp/' + token);
            return ['temp1.jpg'];
        });
        let result = fileHelper.hasValidUploadSaveRange();
        expect(result).to.be.true();
        stub.restore();
        stub = Sinon.stub(fileManager, 'getOnlyFiles', (tempDir)=> {
            expect(tempDir).to.be.equal('temp/' + token);
            return ['temp1.jpg', 'temp2.jpg', 'temp3.jpg'];
        });
        result = fileHelper.hasValidUploadSaveRange();
        expect(result).to.be.true();
        stub.restore();
        stub = Sinon.stub(fileManager, 'getOnlyFiles', (tempDir)=> {
            expect(tempDir).to.be.equal('temp/' + token);
            return [];
        });
        result = fileHelper.hasValidUploadSaveRange();
        expect(result).to.be.false();
        stub.restore();
        stub = Sinon.stub(fileManager, 'getOnlyFiles', (tempDir)=> {
            expect(tempDir).to.be.equal('temp/' + token);
            return ['temp1.jpg', 'temp2.jpg', 'temp3.jpg', 'temp4.jpg'];
        });
        result = fileHelper.hasValidUploadSaveRange();
        expect(result).to.be.false();
        stub.restore();
        next();
    });

    test('test has valid files', (next) => {
        let stub = Sinon.stub(fileManager, 'getOnlyFiles', (tempDir)=> {
            expect(tempDir).to.be.equal('temp/' + token);
            return ['temp1.jpg'];
        });
        let result = fileHelper.hasValidFiles();
        expect(result).to.be.true();
        stub.restore();
        stub = Sinon.stub(fileManager, 'getOnlyFiles', (tempDir)=> {
            expect(tempDir).to.be.equal('temp/' + token);
            return ['temp1.pdf'];
        });
        result = fileHelper.hasValidFiles();
        expect(result).to.be.false();
        stub.restore();
        next();
    });

    test('test has valid files', (next) => {
        let stub = Sinon.stub(fileManager, 'getOnlyFiles', (tempDir)=> {
            expect(tempDir).to.be.equal('temp/' + token);
            return ['temp1.jpg'];
        });
        let result = fileHelper.canSave();
        expect(result).to.be.true();
        stub.restore();
        stub = Sinon.stub(fileManager, 'getOnlyFiles', (tempDir)=> {
            expect(tempDir).to.be.equal('temp/' + token);
            return ['temp1.pdf'];
        });
        result = fileHelper.canSave();
        expect(result).to.be.false();
        stub.restore();
        stub = Sinon.stub(fileManager, 'getOnlyFiles', (tempDir)=> {
            expect(tempDir).to.be.equal('temp/' + token);
            return ['temp1.jpg', 'temp2.jpg', 'temp3.jpg', 'temp4.jpg'];
        });
        result = fileHelper.canSave();
        expect(result).to.be.false();
        stub.restore();
        next();
    });
    test('test get src files', (next) => {
        const stub = Sinon.stub(fileManager, 'getOnlyFiles', (srcDir)=> {
            expect(srcDir).to.be.equal('src/' + ext);
            return ['temp1.jpg'];
        });
        fileHelper.getSrcFiles();
        stub.restore();
        next();
    });
    test('test get temp files', (next) => {
        const stub = Sinon.stub(fileManager, 'getOnlyFiles', (tempDir)=> {
            expect(tempDir).to.be.equal('temp/' + token);
            return ['temp1.jpg'];
        });
        fileHelper.getTempFiles();
        stub.restore();
        next();
    });
    test('test get temp files', (next) => {
        const stub = Sinon.stub(fileManager, 'getOnlyFiles', (srcDir)=> {
            expect(srcDir).to.be.equal('src/' + ext + '/test');
            return ['temp1.jpg'];
        });
        fileHelper.getExtFiles('test');
        stub.restore();
        next();
    });

    suite('Test file upload', () => {

        test('test upload', (next) => {
            const file:any = 'test';
            const fileName = 'test.jpg';

            const stub = Sinon.stub(fileManager, 'getOnlyFiles', (tempDir)=> {
                expect(tempDir).to.be.equal('temp/' + token);
                return ['temp1.jpg'];
            });
            const stub1 = Sinon.stub(fileManager, 'upload', (targetFile, targetFileName, tempDir, callback)=> {
                expect(tempDir).to.be.equal('temp/' + token);
                expect(targetFile).to.be.equal(file);
                expect(targetFileName).to.be.equal(fileName);
                callback();
            });
            const spy = Sinon.spy((error) => {
                expect(error).to.be.undefined();
                stub.restore();
                stub1.restore();
                expect(spy.called).to.be.true();
                next();
            });
            fileHelper.upload(file, fileName, spy);
        });

        test('test upload - not a valid file', (next) => {
            const file:any = 'test';
            const fileName = 'test.exe';

            const stub = Sinon.stub(fileManager, 'getOnlyFiles', (tempDir)=> {
                expect(tempDir).to.be.equal('temp/' + token);
                return ['temp1.jpg'];
            });
            const stub1 = Sinon.stub(fileManager, 'upload', (targetFile, targetFileName, tempDir, callback)=> {
                expect(tempDir).to.be.equal('temp/' + token);
                expect(targetFile).to.be.equal(file);
                expect(targetFileName).to.be.equal(fileName);
                callback();
            });
            const spy = Sinon.spy((error) => {
                expect(error).to.be.exist();
                stub.restore();
                stub1.restore();
                expect(spy.called).to.be.true();
                next();
            });
            fileHelper.upload(file, fileName, spy);
        });
        test('test upload - exceeded the limit', (next) => {
            const file:any = 'test';
            const fileName = 'test.jpg';

            const stub = Sinon.stub(fileManager, 'getOnlyFiles', (tempDir)=> {
                expect(tempDir).to.be.equal('temp/' + token);
                return ['temp1.jpg', 'temp2.jpg', 'temp3.jpg', 'temp4.jpg'];
            });
            const stub1 = Sinon.stub(fileManager, 'upload', (targetFile, targetFileName, tempDir, callback)=> {
                expect(tempDir).to.be.equal('temp/' + token);
                expect(targetFile).to.be.equal(file);
                expect(targetFileName).to.be.equal(fileName);
                callback();
            });
            const spy = Sinon.spy((error) => {
                expect(error).to.be.exist();
                stub.restore();
                stub1.restore();
                expect(spy.called).to.be.true();
                next();
            });
            fileHelper.upload(file, fileName, spy);
        });

    });

    test('test upload - remove file', (next) => {

        const fileName = 'test.jpg';
        const stub = Sinon.stub(fileManager, 'removeFile', (file)=> {
            expect(file).to.be.equal('temp/' + token + '/' + fileName);
        });
        const stub1 = Sinon.stub(Fs, 'isFileSync', (file)=> {
            expect(file).to.be.equal('temp/' + token + '/' + fileName);
            return true;
        });
        fileHelper.removeFile(fileName);
        stub.restore();
        stub1.restore();
        next();
    });

    test('test upload - remove file - not a file', (next) => {

        const fileName = 'test.jpg';
        const stub = Sinon.stub(Fs, 'isFileSync', (file)=> {
            expect(file).to.be.equal('temp/' + token + '/' + fileName);
            return false;
        });
        fileHelper.removeFile(fileName);
        stub.restore();
        next();
    });

});