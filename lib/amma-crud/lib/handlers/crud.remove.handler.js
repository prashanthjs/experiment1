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
var CrudRemoveHandler = (function (_super) {
    __extends(CrudRemoveHandler, _super);
    function CrudRemoveHandler() {
        var _this = this;
        _super.apply(this, arguments);
        this.handler = function (request, reply) {
            var model = _this.getModel();
            var id = ObjectPath.get(request, _this.options.idPath, null);
            model.findById(id, function (err, result) {
                if (err) {
                    reply(Boom.badImplementation(err));
                }
                else if (!result) {
                    reply({});
                }
                else if (ObjectPath.get(result, 'isLocked', false)) {
                    reply(Boom.badImplementation('Cannot be deleted'));
                }
                else {
                    result.remove(function () {
                        reply({});
                    });
                }
            });
        };
        this.getSchema = function () {
            return HandlerSchema.default.CoreRemoveOption;
        };
    }
    return CrudRemoveHandler;
}(CrudCoreHandler.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CrudRemoveHandler;
