var imageOptions = require('./images.options');
module.exports = [
    {
        method: 'GET',
        path: '/stores/{id}/images',
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
        path: '/stores/{id}/images/thumb/{additionalPath}',
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
        path: '/stores/images/{param*}',
        handler: {
            directory: {
                path: imageOptions.srcDir,
                redirectToSlash: true,
                index: true
            }
        }
    }
];
