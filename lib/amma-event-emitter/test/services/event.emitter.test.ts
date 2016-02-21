import Code = require('code');
import Lab = require('lab');
import EventEmitterFactory = require('../../services/event.emitter');
import AsyncEventEmitter = require('async-eventemitter');


let lab = exports.lab = Lab.script(),
  before = lab.before,
  beforeEach = lab.beforeEach,
  afterEach = lab.afterEach,
  after = lab.after,
  expect = Code.expect,
  suite = lab.suite,
  test = lab.test;

suite('Test File upload', () => {
  let EventEmitter;
  before((next) => {
    EventEmitter = new EventEmitterFactory.default();
    return next();
  });
  test('test get', (next) => {
    let emitter = EventEmitter.get();
    expect(emitter).instanceof(AsyncEventEmitter);
    next();
  });
});
