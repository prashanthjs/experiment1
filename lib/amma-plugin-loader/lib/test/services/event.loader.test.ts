import Hapi = require('hapi');
import Code = require('code');
import Lab = require('lab');
import Sinon = require('sinon');
import EventLoader = require('../../services/event.loader');

const lab = exports.lab = Lab.script(),
    expect = Code.expect,
    before = lab.before,
    suite = lab.suite,
    test = lab.test;

class SampleClass {

    method = ()=> {

    };
}
const SampleConfig = [{
    methodName: 'method',
    type: 'onRequest',
    options: {}
}];

suite('Event Loader', () => {
    const server = new Hapi.Server();
    const eventLoader = new EventLoader.default();
    const cls = new SampleClass();
    before((next)=> {
        eventLoader.setServer(server);
        next();
    });
    test('Load Events', (next) => {
        const cls = new SampleClass();
        const stub = Sinon.stub(server, 'ext', (type, func, options) => {
            expect(type).to.be.equal('onRequest');
            expect(func).to.be.equal(cls.method);
        });
        eventLoader.loadEvents(cls, SampleConfig);
        stub.restore();
        next();
    });
    test('Load Events null', (next) => {
        const stub = Sinon.stub(server, 'ext', (type, func, options) => {
            expect(true).to.be.false();
        });
        eventLoader.loadEvents(cls);
        stub.restore();
        next();
    });

});