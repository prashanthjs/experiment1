import Hapi = require('hapi');
import Code = require('code');
import Boom = require('boom');
import Lab = require('lab');
import Sinon = require('sinon');
import Mongoose = require('mongoose');
import ObjectPath = require('object-path');
import Service = require('../../services/user.db.service');
import Bcrypt = require('bcrypt');

const lab = exports.lab = Lab.script(),
    expect = Code.expect,
    suite = lab.suite,
    test = lab.test;

suite('User Db Service', () => {

    const service = new Service.default();

    test('Find by email', (next) => {
        const sampleResponse = {
            _id: 'test'
        };
        const sampleEmail = 'prashanth.p@outlook.com';
        const model = service.getModel();
        const stub = Sinon.stub(model, 'findOne', (email, projection, done) => {
            expect(email).to.be.deep.equal({email: sampleEmail});
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
        service.findByEmail(sampleEmail, null, spy);
    });
});