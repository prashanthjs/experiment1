import Hapi = require('hapi');
import Code = require('code');
import Boom = require('boom');
import Lab = require('lab');
import Sinon = require('sinon');
import Mongoose = require('mongoose');
import ObjectPath = require('object-path');
import Service = require('../../services/store.db.service');
import Bcrypt = require('bcrypt');

const lab = exports.lab = Lab.script(),
    expect = Code.expect,
    suite = lab.suite,
    test = lab.test;

suite('Store Db Service', () => {

    const service = new Service.default();


    test('Find by email', (next) => {
        const sampleResponse = {
            _id: 'test'
        };
        const model = service.getModel();
        const stub = Sinon.stub(model, 'findById', (id, projection, done) => {
            expect(id).to.be.deep.equal('test');
            done(null, sampleResponse);
        });
        const spy = Sinon.spy(()=> {
            expect({
                _id: 'test'
            }).to.not.equal(sampleResponse);
            stub.restore();
            expect(spy.called).to.be.true();
            next();
        });
        service.findById('test', null, spy);
    });


});