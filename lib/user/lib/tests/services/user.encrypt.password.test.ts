import Hapi = require('hapi');
import Code = require('code');
import Boom = require('boom');
import Lab = require('lab');
import Sinon = require('sinon');
import Mongoose = require('mongoose');
import ObjectPath = require('object-path');
import Service = require('../../services/user.encrypt.password');
import Bcrypt = require('bcrypt');

const lab = exports.lab = Lab.script(),
    before = lab.before,
    expect = Code.expect,
    suite = lab.suite,
    test = lab.test;

suite('User Password Encrypt Service', () => {

    const service = new Service.default();

    test('Test Password Request', (next) => {
        const request:any = {
            payload: {
                password: 'test'
            }
        };
        const spy:any = Sinon.spy(()=> {

            expect(request.payload.password).to.not.equal('test');
            expect(spy.called).to.be.true();
            next();
        });
        service.encryptPasswordRequest(request, spy);
    });

    test('Test Password Request', (next) => {
        const request:any = {
            payload: {
                password: 'test'
            }
        };
        const stub = Sinon.stub(Bcrypt, 'hash', (password, salt, callback)=> {
            callback('error');
        });
        const spy:any = Sinon.spy(()=> {
            expect(spy.calledWith(Boom.badImplementation('error'))).to.be.true();
            expect(request.payload.password).to.be.equal('test');
            expect(spy.called).to.be.true();
            stub.restore();
            next();
        });
        service.encryptPasswordRequest(request, spy);
    });
});