"use strict";
var Code = require('code');
var Lab = require('lab');
var Mongoose = require('mongoose');
var DbParserFactory = require('../../services/db.parser.factory').default;
var lab = exports.lab = Lab.script(), before = lab.before, beforeEach = lab.beforeEach, afterEach = lab.afterEach, after = lab.after, expect = Code.expect, suite = lab.suite, test = lab.test;
suite('Test DB Parse', function () {
    var dbParserFactory = new DbParserFactory();
    var dbParser;
    var schema = new Mongoose.Schema({
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
    beforeEach(function (next) {
        dbParser = dbParserFactory.getDbParser(schema);
        return next();
    });
    suite('Test filters', function () {
        test('Test simple filter', function (next) {
            var actual = {
                field: '_id',
                operator: 'contains',
                value: 'str'
            };
            var expected = {
                '$and': [
                    {
                        _id: {
                            '$regex': new RegExp('str', 'i')
                        }
                    }
                ]
            };
            var result = dbParser.parseAndReturnFilters(actual);
            expect(expected).to.deep.equal(result);
            return next();
        });
        test('Test complex filters', function (next) {
            var actual = [
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
            var expected = {
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
            var result = dbParser.parseAndReturnFilters(actual);
            expect(expected).to.deep.equal(result);
            return next();
        });
    });
    suite('Test sort', function () {
        test('Test simple sort', function (next) {
            var actual = {
                field: '_id',
                dir: 'asc'
            };
            var expected = { _id: 'asc' };
            var result = dbParser.parseAndReturnSort(actual);
            expect(expected).to.deep.equal(result);
            return next();
        });
        test('Test complex sort', function (next) {
            var actual = [{
                    field: '_id',
                    dir: 'asc'
                }, {
                    field: 'title',
                    dir: 'desc'
                }];
            var expected = { _id: 'asc', title: 'desc' };
            var result = dbParser.parseAndReturnSort(actual);
            expect(expected).to.deep.equal(result);
            return next();
        });
    });
    suite('Test Options', function () {
        test('Test Options with nothing provided', function (next) {
            var actual = {};
            dbParser.parse(actual);
            expect(dbParser.page).to.be.equal(1);
            expect(dbParser.pageSize).to.be.equal(1000);
            expect(dbParser.sort).to.be.empty();
            expect(dbParser.filter).to.be.empty();
            return next();
        });
        test('Test Options with provided', function (next) {
            var actual = {
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
        test('Test Options with string provided', function (next) {
            var actual = {
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
    suite('Test Operators', function () {
        test('Test Operators', function (next) {
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
