var Hapi = require('hapi');
var Code = require('code');
var Boom = require('boom');
var Lab = require('lab');
var Sinon = require('sinon');
var ObjectPath = require('object-path');
var Service = require('../../services/user.email.unique.validator');
var DbService = require('../../services/user.db.service');
var lab = exports.lab = Lab.script(), before = lab.before, expect = Code.expect, suite = lab.suite, test = lab.test;
suite('User Email Unique validator Service', function () {
    var service = new Service.default();
    var dbService = new DbService.default();
    var server = new Hapi.Server();
    before(function (next) {
        ObjectPath.ensureExists(server, 'settings.app.services', {});
        server.settings.app.services.userDbService = dbService;
        service.setServer(server);
        next();
    });
    test('User Email Unique validator Service - success', function (next) {
        var sampleEmail = 'prashanth.p@outlook.com';
        var stub = Sinon.stub(dbService, 'findByEmail', function (email, projection, done) {
            expect(email).to.be.deep.equal(sampleEmail);
            done();
        });
        var spy = Sinon.spy(function (error) {
            stub.restore();
            expect(error).to.be.undefined();
            expect(spy.called).to.be.true();
            next();
        });
        service.userEmailUniqueValidator(sampleEmail, spy);
    });
    test('User Email Unique validator Service - failure', function (next) {
        var sampleEmail = 'prashanth.p@outlook.com';
        var stub = Sinon.stub(dbService, 'findByEmail', function (email, projection, done) {
            expect(email).to.be.deep.equal(sampleEmail);
            done(null, {_id: 'test'});
        });
        var spy = Sinon.spy(function (error) {
            stub.restore();
            expect(spy.calledWith(Boom.forbidden('Email already exists'))).to.be.true();
            expect(spy.called).to.be.true();
            next();
        });
        service.userEmailUniqueValidator(sampleEmail, spy);
    });
    test('User Email Unique validator Service - returned error', function (next) {
        var sampleEmail = 'prashanth.p@outlook.com';
        var stub = Sinon.stub(dbService, 'findByEmail', function (email, projection, done) {
            expect(email).to.be.deep.equal(sampleEmail);
            done('error', {_id: 'test'});
        });
        var spy = Sinon.spy(function (error) {
            stub.restore();
            expect(error).to.be.equal('error');
            expect(spy.called).to.be.true();
            next();
        });
        service.userEmailUniqueValidator(sampleEmail, spy);
    });
});
