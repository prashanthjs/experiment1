import Hapi = require('hapi');
import Code = require('code');
import Boom = require('boom');
import Lab = require('lab');
import Sinon = require('sinon');
import Mongoose = require('mongoose');
import ObjectPath = require('object-path');
import Service = require('../../services/user.email.unique.validator');
import DbService = require('../../services/user.db.service');

import Bcrypt = require('bcrypt');

const lab = exports.lab = Lab.script(),
    before = lab.before,
    expect = Code.expect,
    suite = lab.suite,
    test = lab.test;

suite('User Email Unique validator Service', () => {

    const service = new Service.default();
    const dbService = new DbService.default();
    const server = new Hapi.Server();

    before((next)=> {
        ObjectPath.ensureExists(server, 'settings.app.services', {});
        server.settings.app.services.userDbService = dbService;
        service.setServer(server);
        next();
    });

    test('User Email Unique validator Service - success', (next) => {

        const sampleEmail = 'prashanth.p@outlook.com';

        const stub = Sinon.stub(dbService, 'findByEmail', (email, projection, done) => {
            expect(email).to.be.deep.equal(sampleEmail);
            done();
        });
        const spy = Sinon.spy((error)=> {
            stub.restore();
            expect(error).to.be.undefined();
            expect(spy.called).to.be.true();
            next();
        });
        service.userEmailUniqueValidator(sampleEmail, spy);
    });

    test('User Email Unique validator Service - failure', (next) => {

        const sampleEmail = 'prashanth.p@outlook.com';

        const stub = Sinon.stub(dbService, 'findByEmail', (email, projection, done) => {
            expect(email).to.be.deep.equal(sampleEmail);
            done(null, {_id: 'test'});
        });
        const spy = Sinon.spy((error)=> {
            stub.restore();
            expect(spy.calledWith(Boom.forbidden('Email already exists'))).to.be.true();
            expect(spy.called).to.be.true();
            next();
        });
        service.userEmailUniqueValidator(sampleEmail, spy);
    });

    test('User Email Unique validator Service - returned error', (next) => {

        const sampleEmail = 'prashanth.p@outlook.com';

        const stub = Sinon.stub(dbService, 'findByEmail', (email, projection, done) => {
            expect(email).to.be.deep.equal(sampleEmail);
            done('error', {_id: 'test'});
        });
        const spy = Sinon.spy((error)=> {
            stub.restore();
            expect(error).to.be.equal('error');
            expect(spy.called).to.be.true();
            next();
        });
        service.userEmailUniqueValidator(sampleEmail, spy);
    });

});