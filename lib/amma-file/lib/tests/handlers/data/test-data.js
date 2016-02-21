var fileOptions = {
    tempDir: 'temp',
    srcDir: 'src',
    thumbnails: [{
        'name': 'thumbnail',
        'width': 200,
        'height': 200,
        quality: 100
    }],
    minUpload: 1,
    maxUpload: 3
};
var options = {
    fileOptions: fileOptions,
    extPath: 'params.extPath',
    tokenPath: 'params.tokenPath'
};
var request = {
    params: {
        additionalPath: 'additionalPath',
        fileName: 'test1.jpg'
    },
    payload: {
        file: {
            hapi: {
                filename: 'test1.jpg',
                headers: {
                    'test': '200kb'
                }
            }
        }
    }
};
Object.defineProperty(exports, "__esModule", {value: true});
exports.default = {
    options: options,
    fileOptions: fileOptions,
    request: request
};
