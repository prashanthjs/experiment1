"use strict";
var DbParser = require('./db.parser');
var DbParserFactory = (function () {
    function DbParserFactory() {
    }
    DbParserFactory.prototype.getDbParser = function (schema) {
        return new DbParser.default(schema);
    };
    return DbParserFactory;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DbParserFactory;
