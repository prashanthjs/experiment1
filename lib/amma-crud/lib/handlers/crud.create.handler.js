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
        this.defaultIdExistsMessage = 'Id exists already';
        this.handler = function (request, reply) {
            var model = _this.getModel();
            var payload = request.payload;
            console.log(payload);
            model.create(payload, function (err, result) {
                if (err) {
                    if ([11000, 11001].indexOf(err.code) !== -1) {
                        var message = ObjectPath.get(_this.options, 'idExistsMessage', _this.defaultIdExistsMessage);
                        reply(Boom.forbidden(message));
                    }
                    else {
                        reply(Boom.forbidden(err));
                    }
                }
                else {
                    model.findById(result._id, _this.options.projections, function (err, result) {
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
            return HandlerSchema.default.CoreCreateOption;
        };
    }
    return CrudCreateHandler;
})(CrudCoreHandler.default);
Object.defineProperty(exports, "__esModule", {value: true});
exports.default = CrudCreateHandler;
