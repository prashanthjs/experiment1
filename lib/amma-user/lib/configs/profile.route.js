"use strict";
var Joi = require('joi');
var imageOptions = {
    tempDir: __dirname + '/../images/temp',
    srcDir: __dirname + '/../images/src',
    validExtensions: ['.jpg', '.png', '.jpeg'],
    maxUpload: 2,
    minUpload: 1,
    thumbnails: [{
            name: 'small',
            width: 100,
            height: 100,
            quality: 90
        }]
};
var routes = [
    {
        method: 'GET',
        path: '/users/profile-create-token/{id?}',
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
        path: '/users/get-images-using-token/{token}',
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
        method: 'GET',
        path: '/users/get-images/{id}',
        config: {
            handler: {
                fileGet: {
                    extPath: 'params.id',
                    fileOptions: imageOptions,
                }
            }
        }
    },
    {
        method: 'POST',
        path: '/users/upload-image/{token}',
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
                maxBytes: 1048576 * 10,
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
        path: '/users/images/save/{id}/{token}',
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
        path: '/users/images/remove/{token}/{fileName}',
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
        path: '/users/get-images-additional/{id}/{additionalPath}',
        config: {
            handler: {
                fileGetAdditional: {
                    extPath: 'params.id',
                    additionalPath: 'params.additionalPath',
                    fileOptions: imageOptions,
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/users/profile-pic/{param*}',
        handler: {
            directory: {
                path: imageOptions.srcDir,
                redirectToSlash: true,
                index: true
            }
        }
    },
    {
        method: 'GET',
        path: '/users/temp-profile-pic/{param*}',
        handler: {
            directory: {
                path: imageOptions.srcDir,
                redirectToSlash: true,
                index: true
            }
        }
    }
];
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = routes;
