import Joi = require('joi');

const imageOptions = {
    tempDir: __dirname + '/../../images/temp',
    srcDir: __dirname + '/../../images/src',
    validExtensions: ['.jpg', '.png', '.jpeg'],
    maxUpload: 5,
    minUpload: 1,
    thumbnails: [{
        name: 'small',
        width: 100,
        height: 100,
        quality: 90
    }]
};
module.exports = [
    {
        method: 'GET',
        path: '/whitelabels/logo/prepare/{id?}',
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
        path: '/whitelabels/logo/temp/{token}',
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
        path: '/whitelabels/{id}/logos',
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
        path: '/whitelabels/logo/temp/upload/{token}',
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
        path: '/whitelabels/logo/temp/save/{id}/{token}',
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
        path: '/whitelabels/logo/temp/remove/{token}/{fileName}',
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
        path: '/whitelabels/logo/additional/{id}/{additionalPath}',
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
        path: '/whitelabels/logo/get/{param*}',
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
        path: '/whitelabels/logo/temp/get/{param*}',
        handler: {
            directory: {
                path: imageOptions.tempDir,
                redirectToSlash: true,
                index: true
            }
        }
    }
];