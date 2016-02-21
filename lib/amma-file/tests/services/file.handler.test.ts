import Hapi = require('hapi');
import Code = require('code');
import Lab = require('lab');
import Sinon = require('sinon');
import FileManager = require('../../services/file.manager');
import FileHelper = require('../../services/file.helper');
import FileHandler = require('../../services/file.handler');
import FileFactory = require( "../../services/file.factory");

const lab = exports.lab = Lab.script(),
    before = lab.before,
    beforeEach = lab.beforeEach,
    afterEach = lab.afterEach,
    after = lab.after,
    expect = Code.expect,
    suite = lab.suite,
    test = lab.test;


suite('File Handler', () => {

    const server = new Hapi.Server();
    const fileFactory = new FileFactory.default();
    const fileManager = new FileManager.default();
    const fileHandler = new FileHandler.default();
    const type = 'product';
    const options = {
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
    before((next)=> {
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


    suite('create token', () => {
        const extPath = 'test';
        const token = 'token';
        const fileHelper = new FileHelper.default(fileManager, options, extPath, token);
        const request:any = {
            params: {
                token: token,
                extPath: extPath,
                type: 'product'
            }
        };

        test('create token - success', (next) => {

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

            fileHandler.createToken(request, spy);
        });
        test('create token - fail', (next) => {

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

            fileHandler.createToken(request, spy);
        });


    });

    suite('Get files', () => {
        const extPath = 'test';
        const token = 'token';
        const fileHelper = new FileHelper.default(fileManager, options, extPath, token);

        let stub;
        beforeEach((next)=> {
            stub = Sinon.stub(fileFactory, 'getInstance', () => {
                return fileHelper;
            });
            next();
        });
        test('get files', (next) => {
            const files = ['test1.jpg'];
            const request:any = {
                params: {
                    extPath: extPath,
                    type: 'product'
                }
            };

            const stub = Sinon.stub(fileHelper, 'getSrcFiles', ()=> {
                return files;
            });
            const spy:any = Sinon.spy((fls)=> {
                stub.restore();
                expect(spy.called).to.true();
                expect(fls).to.only.include({files: files});
                next();
            });

            fileHandler.getFiles(request, spy);
        });

        test('get Temp files', (next) => {
            const files = ['test1.jpg'];
            const request:any = {
                params: {
                    extPath: extPath,
                    token: token,
                    type: type
                }
            };
            const stub = Sinon.stub(fileHelper, 'getTempFiles', ()=> {
                return files;
            });
            const spy:any = Sinon.spy((fls)=> {
                stub.restore();
                expect(spy.called).to.true();
                expect(fls).to.only.include({files: files});
                next();
            });

            fileHandler.getTempFiles(request, spy);
        });

        test('get Additional files', (next) => {
            const files = ['test1.jpg'];
            const request:any = {
                params: {
                    extPath: extPath,
                    type: type,
                    additionalPath: 'additionalPath'
                }
            };
            const stub = Sinon.stub(fileHelper, 'getExtFiles', (additionalPath)=> {
                expect(additionalPath).to.be.equal('additionalPath');
                return files;
            });
            const spy:any = Sinon.spy((fls)=> {
                stub.restore();
                expect(spy.called).to.true();
                expect(fls).to.only.include({files: files});
                next();
            });

            fileHandler.getFilesWithAdditionalPath(request, spy);
        });

        afterEach((next)=> {
            stub.restore();
            next();
        });

    });

    suite('Upload files', () => {
        const extPath = 'test';
        const token = 'token';
        const fileHelper = new FileHelper.default(fileManager, options, extPath, token);
        const request:any = {
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

        let stub;
        beforeEach((next)=> {
            stub = Sinon.stub(fileFactory, 'getInstance', () => {
                return fileHelper;
            });
            next();
        });
        test('upload - success', (next) => {


            const stub = Sinon.stub(fileHelper, 'upload', (file, fileName, callback)=> {
                expect(fileName).to.be.equal(request.payload.file.hapi.filename);
                expect(file).to.only.include(request.payload.file);
                callback(null, {
                    filename: request.payload.file.hapi.filename
                });
            });
            const spy:any = Sinon.spy((result)=> {
                stub.restore();
                expect(spy.called).to.true();
                expect(result.filename).to.be.equal(request.payload.file.hapi.filename);
                expect(result.headers).to.only.include(request.payload.file.hapi.headers);
                next();
            });

            fileHandler.upload(request, spy);
        });

        test('upload - fail', (next) => {
            const stub = Sinon.stub(fileHelper, 'upload', (file, fileName, callback)=> {
                expect(fileName).to.be.equal(request.payload.file.hapi.filename);
                expect(file).to.only.include(request.payload.file);
                callback('error');
            });
            const spy:any = Sinon.spy((result)=> {
                stub.restore();
                expect(spy.called).to.true();
                expect(result.filename).not.to.be.exist();
                next();
            });

            fileHandler.upload(request, spy);
        });

        afterEach((next)=> {
            stub.restore();
            next();
        });

    });

    suite('Save', () => {
        const extPath = 'test';
        const token = 'token';
        const fileHelper = new FileHelper.default(fileManager, options, extPath, token);
        const request:any = {
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

        let stub;
        beforeEach((next)=> {
            stub = Sinon.stub(fileFactory, 'getInstance', () => {
                return fileHelper;
            });
            next();
        });
        test('save - success', (next) => {


            const stub = Sinon.stub(fileHelper, 'syncSrcToTemp', (callback)=> {
                callback();
            });
            const spy:any = Sinon.spy((result)=> {
                stub.restore();
                expect(spy.called).to.true();
                expect(result.success).to.be.true();
                next();
            });

            fileHandler.save(request, spy);
        });

        test('save - fail', (next) => {
            const stub = Sinon.stub(fileHelper, 'syncSrcToTemp', (callback)=> {
                callback('error');
            });
            const spy:any = Sinon.spy((result)=> {
                stub.restore();
                expect(spy.called).to.true();
                expect(result.success).not.to.be.exist();
                next();
            });

            fileHandler.save(request, spy);
        });

        afterEach((next)=> {
            stub.restore();
            next();
        });

    });

    suite('Delete', () => {
        const extPath = 'test';
        const token = 'token';
        const fileHelper = new FileHelper.default(fileManager, options, extPath, token);
        const request:any = {
            params: {
                extPath: extPath,
                token: token,
                type: type,
                fileName: 'test1.jpg'
            }
        };

        let stub;
        beforeEach((next)=> {
            stub = Sinon.stub(fileFactory, 'getInstance', () => {
                return fileHelper;
            });
            next();
        });
        test('delete - success', (next) => {
            const stub = Sinon.stub(fileHelper, 'removeFile', (fileName)=> {
                expect(fileName).to.be.equal('test1.jpg');
            });
            const spy:any = Sinon.spy((result)=> {
                stub.restore();
                expect(spy.called).to.true();
                expect(result.success).to.be.true();
                next();
            });

            fileHandler.removeFile(request, spy);
        });

        afterEach((next)=> {
            stub.restore();
            next();
        });

    });


});