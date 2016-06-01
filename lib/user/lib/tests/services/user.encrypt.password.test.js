"use strict";
var Code = require('code');
var Boom = require('boom');
var Lab = require('lab');
var Sinon = require('sinon');
var Service = require('../../services/user.encrypt.password');
var Bcrypt = require('bcrypt');
var lab = exports.lab = Lab.script(), before = lab.before, expect = Code.expect, suite = lab.suite, test = lab.test;
suite('User Password Encrypt Service', function () {
    var service = new Service.default();
    test('Test Password Request', function (next) {
        var request = {
            payload: {
                password: 'test'
            }
        };
        var spy = Sinon.spy(function () {
            expect(request.payload.password).to.not.equal('test');
            expect(spy.called).to.be.true();
            next();
        });
        service.encryptPasswordRequest(request, spy);
    });
    test('Test Password Request', function (next) {
        var request = {
            payload: {
                password: 'test'
            }
        };
        var stub = Sinon.stub(Bcrypt, 'hash', function (password, salt, callback) {
            callback('error');
        });
        var spy = Sinon.spy(function () {
            expect(spy.calledWith(Boom.badImplementation('error'))).to.be.true();
            expect(request.payload.password).to.be.equal('test');
            expect(spy.called).to.be.true();
            stub.restore();
            next();
        });
        service.encryptPasswordRequest(request, spy);
    });
});
