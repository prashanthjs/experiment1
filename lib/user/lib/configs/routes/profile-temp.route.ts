import Joi = require('joi');

const imageOptions = require('./profile-pic.option');
module.exports = [
    {
        method: 'GET',
        path: '/users/profile-pic/prepare',
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
        path: '/users/{id}/profile-pic/prepare',
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
        path: '/users/{token}/profile-pic-temp',
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
        path: '/users/{token}/profile-pic-temp/upload',
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
        path: '/users/{id}/{token}/profile-pic-temp/save',
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
        path: '/users/{token}/profile-pic-temp/{fileName}',
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
        path: '/users/profile-pic-images-temp/{param*}',
        handler: {
            directory: {
                path: imageOptions.tempDir,
                redirectToSlash: true,
                index: true
            }
        }
    }
];