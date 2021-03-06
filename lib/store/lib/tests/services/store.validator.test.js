"use strict";
var Hapi = require('hapi');
var Code = require('code');
var Boom = require('boom');
var Lab = require('lab');
var Sinon = require('sinon');
var ObjectPath = require('object-path');
var Service = require('../../services/store.validator');
var DbService = require('../../services/store.db.service');
var lab = exports.lab = Lab.script(), before = lab.before, expect = Code.expect, suite = lab.suite, test = lab.test;
suite('Store Unique validator Service', function () {
    var service = new Service.default();
    var dbService = new DbService.default();
    var server = new Hapi.Server();
    before(function (next) {
        ObjectPath.ensureExists(server, 'settings.app.services', {});
        server.settings.app.services.storeDbService = dbService;
        service.setServer(server);
        next();
    });
    test('Parent store - success', function (next) {
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
        service.storeValidator('test', spy);
    });
    test('Parent Store - failure', function (next) {
        var stub = Sinon.stub(dbService, 'findById', function (email, projection, done) {
            expect(email).to.be.deep.equal('test');
            done();
        });
        var spy = Sinon.spy(function (error) {
            stub.restore();
            expect(spy.calledWith(Boom.forbidden('Invalid parent store provided'))).to.be.true();
            expect(spy.called).to.be.true();
            next();
        });
        service.storeValidator('test', spy);
    });
    test('Parent store validator Service - returned error', function (next) {
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
        service.storeValidator('test', spy);
    });
    test('Parent Store - success', function (next) {
        var spy = Sinon.spy(function (error) {
            expect(error).to.be.undefined();
            expect(spy.called).to.be.true();
            next();
        });
        service.storeValidator(null, spy);
    });
});
