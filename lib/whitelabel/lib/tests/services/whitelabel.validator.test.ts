import Hapi = require('hapi');
import Code = require('code');
import Boom = require('boom');
import Lab = require('lab');
import Sinon = require('sinon');
import Mongoose = require('mongoose');
import ObjectPath = require('object-path');
import Service = require('../../services/whitelabel.validator');
import DbService = require('../../services/whitelabel.db.service');

import Bcrypt = require('bcrypt');

const lab = exports.lab = Lab.script(),
    before = lab.before,
    expect = Code.expect,
    suite = lab.suite,
    test = lab.test;

suite('Whitelabel Unique validator Service', () => {

    const service = new Service.default();
    const dbService = new DbService.default();
    const server = new Hapi.Server();

    before((next)=> {
        ObjectPath.ensureExists(server, 'settings.app.services', {});
        server.settings.app.services.whitelabelDbService = dbService;
        service.setServer(server);
        next();
    });

    test('Parent Whitelabel - success', (next) => {

        const stub = Sinon.stub(dbService, 'findById', (email, projection, done) => {
            expect(email).to.be.deep.equal('test');
            done(null, {_id: 'test'});
        });
        const spy = Sinon.spy((error)=> {
            stub.restore();
            expect(error).to.be.undefined();
            expect(spy.called).to.be.true();
            next();
        });
        service.parentChecker('test', spy);
    });

    test('Parent Whitelabel - failure', (next) => {

        const stub = Sinon.stub(dbService, 'findById', (email, projection, done) => {
            expect(email).to.be.deep.equal('test');
            done();
        });
        const spy = Sinon.spy((error)=> {
            stub.restore();
            expect(spy.calledWith(Boom.forbidden('Invalid parent whitelabel provided'))).to.be.true();
            expect(spy.called).to.be.true();
            next();
        });
        service.parentChecker('test', spy);
    });

    test('User Email Unique validator Service - returned error', (next) => {

        const stub = Sinon.stub(dbService, 'findById', (email, projection, done) => {
            expect(email).to.be.deep.equal('test');
            done('error', {_id: 'test'});
        });
        const spy = Sinon.spy((error)=> {
            stub.restore();
            expect(spy.calledWith(Boom.badImplementation('error'))).to.be.true();
            expect(spy.called).to.be.true();

            next();
        });
        service.parentChecker('test', spy);
    });

    test('Parent Whitelabel - success', (next) => {

        const spy = Sinon.spy((error)=> {
            expect(error).to.be.undefined();
            expect(spy.called).to.be.true();
            next();
        });
        service.parentChecker(null, spy);
    });

});