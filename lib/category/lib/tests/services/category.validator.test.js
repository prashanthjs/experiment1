"use strict";
var Hapi = require('hapi');
var Code = require('code');
var Boom = require('boom');
var Lab = require('lab');
var Sinon = require('sinon');
var ObjectPath = require('object-path');
var Service = require('../../services/category.validator');
var DbService = require('../../services/category.db.service');
var lab = exports.lab = Lab.script(), before = lab.before, expect = Code.expect, suite = lab.suite, test = lab.test;
suite('Category Unique validator Service', function () {
    var service = new Service.default();
    var dbService = new DbService.default();
    var server = new Hapi.Server();
    before(function (next) {
        ObjectPath.ensureExists(server, 'settings.app.services', {});
        server.settings.app.services.categoryDbService = dbService;
        service.setServer(server);
        next();
    });
    test('Parent category - success', function (next) {
        var stub = Sinon.stub(dbService, 'findById', function (email, projection, done) {
            expect(email).to.be.deep.equal('test');
            done(null, { _id: 'test' });
        });
        var spy = Sinon.spy(function (error) {
            stub.restore();
            expect(error).to.be.undefined();
            expect(spy.called).to.be.true();
            next();
        });
        service.parentChecker('test', spy);
    });
    test('Parent Category - failure', function (next) {
        var stub = Sinon.stub(dbService, 'findById', function (email, projection, done) {
            expect(email).to.be.deep.equal('test');
            done();
        });
        var spy = Sinon.spy(function (error) {
            stub.restore();
            expect(spy.calledWith(Boom.forbidden('Invalid parent category provided'))).to.be.true();
            expect(spy.called).to.be.true();
            next();
        });
        service.parentChecker('test', spy);
    });
    test('Parent category validator Service - returned error', function (next) {
        var stub = Sinon.stub(dbService, 'findById', function (email, projection, done) {
            expect(email).to.be.deep.equal('test');
            done('error', { _id: 'test' });
        });
        var spy = Sinon.spy(function (error) {
            stub.restore();
            expect(spy.calledWith(Boom.badImplementation('error'))).to.be.true();
            expect(spy.called).to.be.true();
            next();
        });
        service.parentChecker('test', spy);
    });
    test('Parent Category - success', function (next) {
        var spy = Sinon.spy(function (error) {
            expect(error).to.be.undefined();
            expect(spy.called).to.be.true();
            next();
        });
        service.parentChecker(null, spy);
    });
});
