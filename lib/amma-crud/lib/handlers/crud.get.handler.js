"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Boom = require('boom');
var HandlerSchema = require('../schema/handler.schema');
var CrudCoreHandler = require('./crud.core.handler');
var ObjectPath = require('object-path');
var CrudGetHandler = (function (_super) {
    __extends(CrudGetHandler, _super);
    function CrudGetHandler() {
        var _this = this;
        _super.apply(this, arguments);
        this.defaultNotFoundMessage = 'Not found';
        this.handler = function (request, reply) {
            var model = _this.getModel();
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
                    reply(result);
                }
            });
        };
        this.getSchema = function () {
            return HandlerSchema.default.CoreGetOption;
        };
    }
    return CrudGetHandler;
}(CrudCoreHandler.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CrudGetHandler;
