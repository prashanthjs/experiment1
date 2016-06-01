import Joi = require('joi');

const imageOptions = require('./images.options');

module.exports = [
    {
        method: 'GET',
        path: '/categories/{id}/images',
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
        method: 'GET',
        path: '/categories/{id}/images/thumb/{additionalPath}',
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
        path: '/categories/images/{param*}',
        handler: {
            directory: {
                path: imageOptions.srcDir,
                redirectToSlash: true,
                index: true
            }
        }
    }
];