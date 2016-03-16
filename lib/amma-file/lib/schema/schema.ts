import Joi = require('joi');

const ThumbnailSchema = Joi.object({
    name: Joi.string().required(),
    width: Joi.number().required(),
    height: Joi.number().required(),
    quality: Joi.number().required()
});

const FileSchema = Joi.object({
    tempDir: Joi.string().required(),
    srcDir: Joi.string().required(),
    thumbnails: Joi.array().items(ThumbnailSchema),
    validExtensions: Joi.array().items(Joi.string()),
    maxUpload: Joi.number().required(),
    minUpload: Joi.number().required()
});

const FileHandlerSchema = Joi.object({
    fileOptions: FileSchema,
    additionalPath: Joi.string(),
    extPath: Joi.string(),
    tokenPath: Joi.string()
});

export default {
    ThumbnailSchema: ThumbnailSchema,
    FileSchema: FileSchema,
    FileHandlerSchema: FileHandlerSchema
};