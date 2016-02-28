import Hapi = require('hapi');
import Code = require('code');
import Lab = require('lab');
import Sinon = require('sinon');
import Mongoose = require('mongoose');
import DocumentService = require('../../services/document.service');
import DbParserFactory = require('../../../../amma-db-parser/lib/services/db.parser.factory');

const lab = exports.lab = Lab.script(),
    before = lab.before,
    expect = Code.expect,
    suite = lab.suite,
    test = lab.test;

suite('Document Service Handler', () => {
    const server = new Hapi.Server();
    const documentService = new DocumentService.default();
    const dbParserFactory = new DbParserFactory.default();
    const schema = new Mongoose.Schema({});
    const collectionName = 'string';
    const queryOptions = {
        page: 2,
        pageSize: 10,
        skip: 10,
        filter: {
            field: '_id',
            operator: 'contains',
            value: 'str'
        },
        sort: {
            field: '_id',
            dir: 'asc'
        }
    };
    const projections = {'_id': 1};
    before((next)=> {
        documentService.setServer(server);
        documentService.setDbParser(dbParserFactory.getDbParser(schema));
        documentService.setCollectionName(collectionName);
        documentService.setSchema(schema);
        next();
    });

    test('find all', (next) => {
        const query = {
            sort: function (sort) {
                return this;
            },
            skip: function (skip) {
                expect(queryOptions.skip).to.be.equal(skip);
                return this;
            },
            limit: function (limit) {
                expect(queryOptions.pageSize).to.be.equal(limit);
                return this;
            },
            exec: function (done) {
                done();
            }
        };

        const model = documentService.getModel();
        const stub = Sinon.stub(model, 'find', (filter, proj) => {
            expect(projections).to.deep.equal(proj);
            return query;
        });
        const spy = Sinon.spy(()=> {
            stub.restore();
            expect(spy.called).to.be.true();
            next();
        });

        documentService.findAll(queryOptions, projections, spy);
    });

    test('find count', (next) => {
        const query = {
            exec: function (done) {
                done();
            }
        };
        const model = documentService.getModel();
        const stub = Sinon.stub(model, 'count', (filter) => {
            return query;
        });
        const spy = Sinon.spy(()=> {
            stub.restore();
            expect(spy.called).to.be.true();
            next();
        });

        documentService.findAllCount(queryOptions, spy);
    });

    test('find By Id', (next) => {
        const query = {
            exec: function (done) {
                done();
            }
        };
        const model = documentService.getModel();
        const stub = Sinon.stub(model, 'findById', (id, proj) => {
            expect(id).to.be.equal('id');
            expect(proj).to.be.deep.equal(projections);
            return query;
        });
        const spy = Sinon.spy(()=> {
            stub.restore();
            expect(spy.called).to.be.true();
            next();
        });

        documentService.findById('id', projections, spy);
    });

    test('find One', (next) => {
        const query = {
            exec: function (done) {
                done();
            }
        };
        const model = documentService.getModel();
        const stub = Sinon.stub(model, 'findOne', (filters, proj) => {
            expect(proj).to.be.deep.equal(projections);
            return query;
        });
        const spy = Sinon.spy(()=> {
            stub.restore();
            expect(spy.called).to.be.true();
            next();
        });

        documentService.findOne({id: 20}, projections, spy);
    });

    test('find One', (next) => {
        const query = {
            exec: function (done) {
                done();
            }
        };
        const model = documentService.getModel();
        const stub = Sinon.stub(model, 'findOne', (filters, proj) => {
            expect(proj).to.be.deep.equal(projections);
            return query;
        });
        const spy = Sinon.spy(()=> {
            stub.restore();
            expect(spy.called).to.be.true();
            next();
        });

        documentService.findOne({id: 20}, projections, spy);
    });

    test('Create', (next) => {
        const payload:any = {'_id': 'dfas'};
        const model = documentService.getModel();
        const stub = Sinon.stub(model, 'create', (data, done) => {
            expect(data).to.be.deep.equal(payload);
            return done();
        });
        const spy = Sinon.spy(()=> {
            stub.restore();
            expect(spy.called).to.be.true();
            next();
        });

        documentService.create(payload, spy);
    });
    test('find by id and update', (next) => {
        const payload:any = {'test': 'dfas'};
        const model = documentService.getModel();
        const stub = Sinon.stub(model, 'findByIdAndUpdate', (id, data, options, done) => {
            expect(id).to.be.deep.equal('test');
            expect(options).to.be.deep.equal({upsert: true});
            expect(data).to.be.deep.equal(payload);
            return done();
        });
        const spy = Sinon.spy(()=> {
            stub.restore();
            expect(spy.called).to.be.true();
            next();
        });

        documentService.findByIdAndUpdate('test', payload, spy);
    });
    test('find by id and remove', (next) => {
        // test coverage
        const documentService = new DocumentService.default();
        documentService.setServer(server);
        documentService.setDbParser(dbParserFactory.getDbParser(schema));
        documentService.setCollectionName(collectionName);
        documentService.setSchema(schema);

        const model = documentService.getModel();
        const stub = Sinon.stub(model, 'findByIdAndRemove', (id, done) => {
            expect(id).to.be.deep.equal('test');
            return done();
        });
        const spy = Sinon.spy(()=> {
            stub.restore();
            expect(spy.called).to.be.true();
            next();
        });

        documentService.findByIdAndRemove('test', spy);
    });
});