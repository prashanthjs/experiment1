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
var ObjectPath = require('object-path');
var CrudCreateHandler = (function (_super) {
    __extends(CrudCreateHandler, _super);
    function CrudCreateHandler() {
        var _this = this;
        _super.apply(this, arguments);
        this.defaultNotFoundMessage = 'Not found';
        this.handler = function (request, reply) {
            var model = _this.getModel();
            var payload = request.payload;
            var id = ObjectPath.get(request, _this.options.idPath, null);
            model.findById(id, _this.options.projections, function (err, result) {
                if (err) {
                    reply(Boom.badImplementation(err));
                }
                else if (!result) {
                    var message = ObjectPath.get(_this.options, 'notFoundMessage', _this.defaultNotFoundMessage);
                    reply(Boom.notFound(message));
                }
                else {
                    _this.update(id, payload, reply);
                }
            });
        };
        this.update = function (id, payload, reply) {
            var model = _this.getModel();
            model.findByIdAndUpdate(id, payload, function (err, result) {
                if (err) {
                    reply(Boom.forbidden(err));
                }
                else {
                    model.findById(id, _this.options.projections, function (err, result) {
                        if (err) {
                            reply(Boom.badImplementation(err));
                        }
                        else {
                            reply(result);
                        }
                    });
                }
            });
        };
        this.getSchema = function () {
            return HandlerSchema.default.CoreUpdateOption;
        };
    }
    return CrudCreateHandler;
})(CrudCoreHandler.default);
Object.defineProperty(exports, "__esModule", {value: true});
exports.default = CrudCreateHandler;
