const services = [
    {
        cls: require('../services/file.factory').default,
        name: 'fileFactory',
    },
    {
        cls: require('../services/file.manager').default,
        name: 'fileManager',
    },
    {
        cls: require('../handlers/file.factory.handler').default,
        handlers: [
            {
                name: 'fileGet',
                methodName: 'handlerFileGet'
            },
            {
                name: 'fileGetTemp',
                methodName: 'handlerFileGetTemp'
            },
            {
                name: 'fileGetAdditional',
                methodName: 'handlerFileGetAdditional'
            },
            {
                name: 'fileRemove',
                methodName: 'handlerFileRemove'
            },
            {
                name: 'fileSave',
                methodName: 'handlerFileSave'
            },
            {
                name: 'fileToken',
                methodName: 'handlerFileToken'
            },
            {
                name: 'fileUpload',
                methodName: 'handlerFileUpload'
            }
        ]
    }
];

export default services;