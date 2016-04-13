var Code = require('code');
var Lab = require('lab');
var Sinon = require('sinon');
var Service = require('../../services/user.db.service');
var lab = exports.lab = Lab.script(), expect = Code.expect, suite = lab.suite, test = lab.test;
suite('User Db Service', function () {
    var service = new Service.default();
    test('Find by email', function (next) {
        var sampleResponse = {
            _id: 'test'
        };
        var sampleEmail = 'prashanth.p@outlook.com';
        var model = service.getModel();
        var stub = Sinon.stub(model, 'findOne', function (email, projection, done) {
            expect(email).to.be.deep.equal({email: sampleEmail});
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
        service.findByEmail(sampleEmail, null, spy);
    });
});
