var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }

        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
var Boom = require('boom');
var HandlerSchema = require('../schema/handler.schema');
var CrudCoreHandler = require('./crud.core.handler');
var Async = require('async');
var CrudGetAllHandler = (function (_super) {
    __extends(CrudGetAllHandler, _super);
    function CrudGetAllHandler() {
        var _this = this;
        _super.apply(this, arguments);
        this.handler = function (request, reply) {
            var model = _this.getModel();
            Async.series({
                results: function (callback) {
                    model.findAll(request.query, _this.options.projections, callback);
                },
                total: function (callback) {
                    model.findAllCount(request.query, callback);
                }
            }, function (err, results) {
                if (err) {
                    return reply(Boom.badImplementation(err));
                }
                else {
                    var res = {
                        results: results.results,
                        meta: {
                            total: results.total
                        }
                    };
                    reply(res);
                }
            });
        };
        this.getSchema = function () {
            return HandlerSchema.default.CoreGetAllOption;
        };
    }
    return CrudGetAllHandler;
})(CrudCoreHandler.default);
Object.defineProperty(exports, "__esModule", {value: true});
exports.default = CrudGetAllHandler;
