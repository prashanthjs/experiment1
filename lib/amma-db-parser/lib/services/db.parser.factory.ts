import Mongoose = require('mongoose');
import DbParser = require('./db.parser');

export interface IDbParserFactory {
    getDbParser(schema?:Mongoose.Schema):DbParser.IDbParser;
}

class DbParserFactory implements IDbParserFactory {

    getDbParser(schema?:Mongoose.Schema):DbParser.IDbParser {
        return new DbParser.default(schema);
    }

}
export default DbParserFactory;