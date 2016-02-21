import Hapi = require('hapi');
import Code = require('code');
import Lab = require('lab');
import Sinon = require('sinon');
import Mongoose = require('mongoose');

let DbParserFactory = require('../../services/db.parser').default;
let lab = exports.lab = Lab.script(),
  before = lab.before,
  beforeEach = lab.beforeEach,
  afterEach = lab.afterEach,
  after = lab.after,
  expect = Code.expect,
  suite = lab.suite,
  test = lab.test;


suite('Test DB Parse', () => {
  let dbParserFactory = new DbParserFactory();
  let dbParser;
  let schema = new Mongoose.Schema({
    _id: {
      type: String,
      require: true
    },
    title: {
      type: String,
      require: true
    },
    price: {
      type: Number,
      require: true
    },
    isActive: {
      type: Boolean,
      require: true
    },
    created: {
      type: Date,
      require: true
    },
    buffer: {
      type: Buffer,
      require: true
    }
  });
  beforeEach((next) => {
    dbParser = dbParserFactory.getDbParser(schema);
    return next();
  });
  suite('Test filters', () => {

    test('Test simple filter', (next) => {
      let actual = {
        field: '_id',
        operator: 'contains',
        value: 'str'
      };
      let expected = {
        '$and': [
          {
            _id: {
              '$regex': new RegExp('str', 'i')
            }
          }
        ]
      };
      let result = dbParser.parseAndReturnFilters(actual);
      expect(expected).to.deep.equal(result);
      return next();
    });

    test('Test complex filters', (next) => {
      let actual = [
        {
          logic: "or",
          filters: [
            {
              field: "price",
              operator: "eq",
              value: 11.61
            },
            {
              field: "price",
              operator: "eq",
              value: 51.31
            }
          ]
        },
        {
          field: "title",
          operator: "startswith",
          value: "Char"
        }
      ];
      let expected = {
        '$and': [
          {
            '$or': [
              { price: 11.61 },
              { price: 51.31 }
            ]
          }, {
            title: {
              '$regex': new RegExp('^Char', 'i')
            }
          }
        ]
      };
      let result = dbParser.parseAndReturnFilters(actual);
      expect(expected).to.deep.equal(result);
      return next();
    });


  });

  suite('Test sort', () => {
    test('Test simple sort', (next) => {
      let actual = {
        field: '_id',
        dir: 'asc'
      };
      let expected = { _id: 'asc' };
      let result = dbParser.parseAndReturnSort(actual);
      expect(expected).to.deep.equal(result);
      return next();
    });
    test('Test complex sort', (next) => {
      let actual = [{
        field: '_id',
        dir: 'asc'
      }, {
          field: 'title',
          dir: 'desc'
        }];
      let expected = { _id: 'asc', title: 'desc' };
      let result = dbParser.parseAndReturnSort(actual);
      expect(expected).to.deep.equal(result);
      return next();
    });

  });

  suite('Test Options', () => {
    test('Test Options with nothing provided', (next) => {
      let actual = {};
      dbParser.parse(actual);
      expect(dbParser.page).to.be.equal(1);
      expect(dbParser.pageSize).to.be.equal(1000);
      expect(dbParser.sort).to.be.empty();
      expect(dbParser.filter).to.be.empty();
      return next();
    });

    test('Test Options with provided', (next) => {
      let actual = {
        page: 2,
        pageSize: 10,
        skip: 10,
        filter: {
          field: '_id',
          operator: 'contains',
          value: 'str'
        },
        sort: {
          field: '_id',
          dir: 'asc'
        }
      };
      dbParser.parse(actual);
      expect(dbParser.page).to.be.equal(2);
      expect(dbParser.skip).to.be.equal(10);
      expect(dbParser.pageSize).to.be.equal(10);
      expect(dbParser.sort).not.to.be.empty();
      expect(dbParser.filter).not.to.be.empty();
      return next();
    });
    test('Test Options with string provided', (next) => {
      let actual = {
        page: '2',
        skip: '10',
        pageSize: '10',
        filter: '{}',
        sort: "{}"
      };
      dbParser.parse(actual);
      expect(dbParser.page).to.be.equal(2);
      expect(dbParser.skip).to.be.equal(10);
      expect(dbParser.pageSize).to.be.equal(10);
      expect(dbParser.sort).not.to.be.empty();
      expect(dbParser.filter).not.to.be.empty();
      return next();
    });

  });

  suite('Test Operators', () => {
    test('Test Operators', (next) => {
      expect(dbParser.parseAndReturnValue('_id', 'str', 'contains'))
        .to.deep.equal({ $regex: new RegExp('str', 'i') });

      expect(dbParser.parseAndReturnValue('_id', 'str', 'doesnotcontain'))
        .to.deep.equal({ $ne: { $regex: new RegExp('str', 'i') } });

      expect(dbParser.parseAndReturnValue('_id', 'str', 'startswith'))
        .to.deep.equal({ $regex: new RegExp('^str', 'i') });

      expect(dbParser.parseAndReturnValue('_id', 'str', 'endswith'))
        .to.deep.equal({ $regex: new RegExp('str$', 'i') });

      expect(dbParser.parseAndReturnValue('_id', 'str', 'eq'))
        .to.deep.equal({ $regex: new RegExp('^str$', 'i') });

      expect(dbParser.parseAndReturnValue('price', 10, 'eq'))
        .to.be.equal(10);

      expect(dbParser.parseAndReturnValue('price', 10, 'ne'))
        .to.deep.equal({ $ne: 10 });

      expect(dbParser.parseAndReturnValue('price', 10, 'gt'))
        .to.deep.equal({ $gt: 10 });

      expect(dbParser.parseAndReturnValue('price', 10, 'gte'))
        .to.deep.equal({ $gte: 10 });

      expect(dbParser.parseAndReturnValue('price', 10, 'lt'))
        .to.deep.equal({ $lt: 10 });

      expect(dbParser.parseAndReturnValue('price', 10, 'lte'))
        .to.deep.equal({ $lte: 10 });

      expect(dbParser.parseAndReturnValue('price1', 10, 'lte'))
        .to.deep.equal({ $lte: 10 });

      expect(dbParser.parseAndReturnValue('price1', 10, 'ltequal'))
        .to.be.equal(10);

      expect(dbParser.parseAndReturnValue('created', '2015-10-15'))
        .to.deep.equal('2015-10-15');

      expect(dbParser.parseAndReturnValue('isActive', true))
        .to.deep.equal(true);

      expect(dbParser.parseAndReturnValue('buffer', 'dfsd'))
        .to.deep.equal('dfsd');

      return next();
    });

  });

});
