const fileOptions = {
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
const options = {
    fileOptions: fileOptions,
    extPath: 'params.extPath',
    tokenPath: 'params.tokenPath'
};

const request = {
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

export default {
    options: options,
    fileOptions: fileOptions,
    request: request
};