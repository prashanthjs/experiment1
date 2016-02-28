import Joi = require('joi');

const MethodSchema = Joi.object({
    methodName: Joi.string().required(),
    name: Joi.string().required(),
    options: Joi.object()
});
const MethodSchemas = Joi.array().items(MethodSchema);

const HandlerSchema = Joi.object({
    methodName: Joi.string().required(),
    name: Joi.string().required()
});
const HandlerSchemas = Joi.array().items(HandlerSchema);

const EventSchema = Joi.object({
    type: Joi.string().required(),
    methodName: Joi.string().required(),
    options: Joi.object()
});
const EventSchemas = Joi.array().items(EventSchema);

const ServiceSchema = Joi.object({
    name: Joi.string(),
    cls: Joi.func().required(),
    methods: MethodSchemas,
    handlers: HandlerSchemas,
    events: EventSchemas
});

const ServiceSchemas = Joi.array().items(ServiceSchema);

const ConfigSchema = Joi.object({
    app: Joi.object(),
    config: Joi.object(),
    services: ServiceSchemas,
    routes: Joi.array().items(Joi.object()),
    attributes: Joi.object({
        pkg: Joi.object().required()
    }).required()
});

export default  {
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