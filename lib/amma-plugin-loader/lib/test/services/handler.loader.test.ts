import Hapi = require('hapi');
import Code = require('code');
import Lab = require('lab');
import Sinon = require('sinon');
import HandlerLoader = require('../../services/handler.loader');

let lab = exports.lab = Lab.script(),
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
}];
suite('Handler Loader', () => {
    const server = new Hapi.Server();
    const cls = new SampleClass();
    const handlerLoader = new HandlerLoader.default();
    handlerLoader.setServer(server);
    test('Load handler', (next) => {
        const cls = new SampleClass();
        const stub = Sinon.stub(server, 'handler', (name, func) => {
            expect(name).to.be.equal('name');
            expect(func).to.be.equal(cls.method);
        });
        handlerLoader.loadHandlers(cls, SampleConfig);
        stub.restore();
        next();
    });
    test('Load handlers - null', (next) => {
        const stub = Sinon.stub(server, 'handler', (name, func) => {
            expect(true).to.be.false();
        });
        handlerLoader.loadHandlers(cls);
        stub.restore();
        next();
    });

});