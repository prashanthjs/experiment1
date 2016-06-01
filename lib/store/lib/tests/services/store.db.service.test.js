"use strict";
var Code = require('code');
var Lab = require('lab');
var Sinon = require('sinon');
var Service = require('../../services/store.db.service');
var lab = exports.lab = Lab.script(), expect = Code.expect, suite = lab.suite, test = lab.test;
suite('Store Db Service', function () {
    var service = new Service.default();
    test('Find by email', function (next) {
        var sampleResponse = {
            _id: 'test'
        };
        var model = service.getModel();
        var stub = Sinon.stub(model, 'findById', function (id, projection, done) {
            expect(id).to.be.deep.equal('test');
            done(null, sampleResponse);
        });
        var spy = Sinon.spy(function () {
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
