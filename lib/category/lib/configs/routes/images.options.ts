module.exports = {
    tempDir: __dirname + '/../../images/temp',
    srcDir: __dirname + '/../../images/src',
    validExtensions: ['.jpg', '.png', '.jpeg'],
    maxUpload: 5,
    minUpload: 0,
    thumbnails: [{
        name: 'small',
        width: 100,
        height: 100,
        quality: 90
    }]
};