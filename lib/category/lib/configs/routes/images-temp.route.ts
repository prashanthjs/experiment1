import Joi = require('joi');

const imageOptions = require('./images.options');
module.exports = [
    {
        method: 'GET',
        path: '/categories/images/prepare',
        config: {
            handler: {
                fileToken: {
                    extPath: 'params.id',
                    tokenPath: 'params.token',
                    fileOptions: imageOptions,
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/categories/{id}/images/prepare',
        config: {
            handler: {
                fileToken: {
                    extPath: 'params.id',
                    tokenPath: 'params.token',
                    fileOptions: imageOptions,
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/categories/{token}/images-temp',
        config: {
            handler: {
                fileGetTemp: {
                    tokenPath: 'params.token',
                    fileOptions: imageOptions,
                }
            }
        }
    },
    {
        method: 'POST',
        path: '/categories/{token}/images-temp/upload',
        config: {
            handler: {
                fileUpload: {
                    tokenPath: 'params.token',
                    fileOptions: imageOptions,
                }
            },
            payload: {
                output: 'stream',
                parse: true,
                allow: 'multipart/form-data',
                maxBytes: 1048576 * 10, // 10MB
            },
            validate: {
                payload: {
                    file: Joi.object().required()
                }
            },
        }
    },
    {
        method: 'GET',
        path: '/categories/{id}/{token}/images-temp/save',
        config: {
            handler: {
                fileSave: {
                    extPath: 'params.id',
                    tokenPath: 'params.token',
                    fileOptions: imageOptions,
                }
            }
        }
    },
    {
        method: 'DELETE',
        path: '/categories/{token}/images-temp/{fileName}',
        config: {
            handler: {
                fileRemove: {
                    tokenPath: 'params.token',
                    fileOptions: imageOptions,
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/categories/images-temp/{param*}',
        handler: {
            directory: {
                path: imageOptions.tempDir,
                redirectToSlash: true,
                index: true
            }
        }
    }
];