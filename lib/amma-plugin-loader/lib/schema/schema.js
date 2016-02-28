var Joi = require('joi');
var MethodSchema = Joi.object({
    methodName: Joi.string().required(),
    name: Joi.string().required(),
    options: Joi.object()
});
var MethodSchemas = Joi.array().items(MethodSchema);
var HandlerSchema = Joi.object({
    methodName: Joi.string().required(),
    name: Joi.string().required()
});
var HandlerSchemas = Joi.array().items(HandlerSchema);
var EventSchema = Joi.object({
    type: Joi.string().required(),
    methodName: Joi.string().required(),
    options: Joi.object()
});
var EventSchemas = Joi.array().items(EventSchema);
var ServiceSchema = Joi.object({
    name: Joi.string(),
    cls: Joi.func().required(),
    methods: MethodSchemas,
    handlers: HandlerSchemas,
    events: EventSchemas
});
var ServiceSchemas = Joi.array().items(ServiceSchema);
var ConfigSchema = Joi.object({
    app: Joi.object(),
    config: Joi.object(),
    services: ServiceSchemas,
    routes: Joi.array().items(Joi.object()),
    attributes: Joi.object({
        pkg: Joi.object().required()
    }).required()
});
Object.defineProperty(exports, "__esModule", {value: true});
exports.default = {
    ServiceSchema: ServiceSchema,
    ServiceSchemas: ServiceSchemas,
    ConfigSchema: ConfigSchema,
    MethodSchema: MethodSchema,
    MethodSchemas: MethodSchemas,
    HandlerSchemas: HandlerSchemas,
    HandlerSchema: HandlerSchema,
    EventSchema: EventSchema,
    EventSchemas: EventSchemas
};
