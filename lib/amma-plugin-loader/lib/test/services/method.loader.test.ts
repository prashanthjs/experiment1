import Hapi = require('hapi');
import Code = require('code');
import Lab = require('lab');
import Sinon = require('sinon');
import MethodLoader = require('../../services/method.loader');

let lab = exports.lab = Lab.script(),
    before = lab.before,
    beforeEach = lab.beforeEach,
    afterEach = lab.afterEach,
    after = lab.after,
    expect = Code.expect,
    suite = lab.suite,
    test = lab.test;

class SampleClass {

    method = ()=> {

    };
}
const SampleConfig = [{
    methodName: 'method',
    name: 'name',
    options: {}
}];

suite('Method Loader', () => {
    const server = new Hapi.Server();
    const methodLoader = new MethodLoader.default();
    methodLoader.setServer(server);
    test('Load method', (next) => {
        const cls = new SampleClass();
        const stub = Sinon.stub(server, 'method', (name, func, options) => {
            expect(name).to.be.equal('name');
            expect(func).to.be.equal(cls.method);
        });
        methodLoader.loadMethods(cls, SampleConfig);
        stub.restore();
        next();
    });
    test('Load method', (next) => {
        const cls = new SampleClass();
        const stub = Sinon.stub(server, 'method', (name, func, options) => {
            expect(true).to.be.false();
        });
        methodLoader.loadMethods(cls);
        stub.restore();
        next();
    });

});