"use strict";
var imageOptions = require('./profile-pic.option');
module.exports = [
    {
        method: 'GET',
        path: '/users/{id}/profile-pic',
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
        path: '/users/{id}/profile-pic/thumb/{additionalPath}',
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
        path: '/users/profile-pic-images/{param*}',
        handler: {
            directory: {
                path: imageOptions.srcDir,
                redirectToSlash: true,
                index: true
            }
        }
    }
];
