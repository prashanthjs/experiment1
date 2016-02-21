var Mongoose = require("mongoose");
var Db = (function () {
    function Db() {
        var _this = this;
        this.setServer = function (server) {
            _this.server = server;
        };
        this.init = function (next) {
            _this.connectDb(next);
        };
        this.connectDb = function (next) {
            var options = _this.getOptions();
            var db = Mongoose.connect(options.uri, options.options, function (err) {
                if (err) {
                    _this.server.log('error', 'Could not connect to MongoDB! ' + options.uri + '\n');
                    next(err);
                }
                else {
                    _this.server.log('success', 'Connected to MongoDB ' + options.uri + '\n');
                    next();
                }
            });
            _this.server.expose('db', db);
        };
        this.disconnectDb = function (next) {
            Mongoose.disconnect(function (err) {
                _this.server.log('Disconnected from MongoDB.');
                return next();
            });
        };
    }
    Db.prototype.getOptions = function () {
        return this.server.settings.app.db;
    };
    return Db;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Db;
