var Hapi = require('hapi');
var Code = require('code');
var Lab = require('lab');
var Sinon = require('sinon');
var Mongoose = require('mongoose');
var DocumentService = require('../../services/document.service');
var DbParserFactory = require('../../../../amma-db-parser/lib/services/db.parser.factory');
var lab = exports.lab = Lab.script(), before = lab.before, expect = Code.expect, suite = lab.suite, test = lab.test;
suite('Document Service Handler', function () {
    var server = new Hapi.Server();
    var documentService = new DocumentService.default();
    var dbParserFactory = new DbParserFactory.default();
    var schema = new Mongoose.Schema({});
    var collectionName = 'string';
    var queryOptions = {
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
    var projections = {'_id': 1};
    before(function (next) {
        documentService.setServer(server);
        documentService.setDbParser(dbParserFactory.getDbParser(schema));
        documentService.setCollectionName(collectionName);
        documentService.setSchema(schema);
        next();
    });
    test('find all', function (next) {
        var query = {
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
        var model = documentService.getModel();
        var stub = Sinon.stub(model, 'find', function (filter, proj) {
            expect(projections).to.deep.equal(proj);
            return query;
        });
        var spy = Sinon.spy(function () {
            stub.restore();
            expect(spy.called).to.be.true();
            next();
        });
        documentService.findAll(queryOptions, projections, spy);
    });
    test('find count', function (next) {
        var query = {
            exec: function (done) {
                done();
            }
        };
        var model = documentService.getModel();
        var stub = Sinon.stub(model, 'count', function (filter) {
            return query;
        });
        var spy = Sinon.spy(function () {
            stub.restore();
            expect(spy.called).to.be.true();
            next();
        });
        documentService.findAllCount(queryOptions, spy);
    });
    test('find By Id', function (next) {
        var query = {
            exec: function (done) {
                done();
            }
        };
        var model = documentService.getModel();
        var stub = Sinon.stub(model, 'findById', function (id, proj) {
            expect(id).to.be.equal('id');
            expect(proj).to.be.deep.equal(projections);
            return query;
        });
        var spy = Sinon.spy(function () {
            stub.restore();
            expect(spy.called).to.be.true();
            next();
        });
        documentService.findById('id', projections, spy);
    });
    test('find One', function (next) {
        var query = {
            exec: function (done) {
                done();
            }
        };
        var model = documentService.getModel();
        var stub = Sinon.stub(model, 'findOne', function (filters, proj) {
            expect(proj).to.be.deep.equal(projections);
            return query;
        });
        var spy = Sinon.spy(function () {
            stub.restore();
            expect(spy.called).to.be.true();
            next();
        });
        documentService.findOne({id: 20}, projections, spy);
    });
    test('find One', function (next) {
        var query = {
            exec: function (done) {
                done();
            }
        };
        var model = documentService.getModel();
        var stub = Sinon.stub(model, 'findOne', function (filters, proj) {
            expect(proj).to.be.deep.equal(projections);
            return query;
        });
        var spy = Sinon.spy(function () {
            stub.restore();
            expect(spy.called).to.be.true();
            next();
        });
        documentService.findOne({id: 20}, projections, spy);
    });
    test('Create', function (next) {
        var payload = {'_id': 'dfas'};
        var model = documentService.getModel();
        var stub = Sinon.stub(model, 'create', function (data, done) {
            expect(data).to.be.deep.equal(payload);
            return done();
        });
        var spy = Sinon.spy(function () {
            stub.restore();
            expect(spy.called).to.be.true();
            next();
        });
        documentService.create(payload, spy);
    });
    test('find by id and update', function (next) {
        var payload = {'test': 'dfas'};
        var model = documentService.getModel();
        var stub = Sinon.stub(model, 'findByIdAndUpdate', function (id, data, options, done) {
            expect(id).to.be.deep.equal('test');
            expect(options).to.be.deep.equal({upsert: true});
            expect(data).to.be.deep.equal(payload);
            return done();
        });
        var spy = Sinon.spy(function () {
            stub.restore();
            expect(spy.called).to.be.true();
            next();
        });
        documentService.findByIdAndUpdate('test', payload, spy);
    });
    test('find by id and remove', function (next) {
        // test coverage
        var documentService = new DocumentService.default();
        documentService.setServer(server);
        documentService.setDbParser(dbParserFactory.getDbParser(schema));
        documentService.setCollectionName(collectionName);
        documentService.setSchema(schema);
        var model = documentService.getModel();
        var stub = Sinon.stub(model, 'findByIdAndRemove', function (id, done) {
            expect(id).to.be.deep.equal('test');
            return done();
        });
        var spy = Sinon.spy(function () {
            stub.restore();
            expect(spy.called).to.be.true();
            next();
        });
        documentService.findByIdAndRemove('test', spy);
    });
});
