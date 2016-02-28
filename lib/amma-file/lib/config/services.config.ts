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
        cls: require('../handlers/file.get.handler').default,
        handlers: [
            {
                name: 'fileGet',
                methodName: 'handlerInit'
            }
        ]
    },
    {
        cls: require('../handlers/file.get.temp.handler').default,
        handlers: [
            {
                name: 'fileGetTemp',
                methodName: 'handlerInit'
            }
        ]
    },
    {
        cls: require('../handlers/file.get.additional.handler').default,
        handlers: [
            {
                name: 'fileGetAdditional',
                methodName: 'handlerInit'
            }
        ]
    },
    {
        cls: require('../handlers/file.remove.handler').default,
        handlers: [
            {
                name: 'fileRemove',
                methodName: 'handlerInit'
            }
        ]
    },
    {
        cls: require('../handlers/file.save.handler').default,
        handlers: [
            {
                name: 'fileSave',
                methodName: 'handlerInit'
            }
        ]
    },
    {
        cls: require('../handlers/file.token.handler').default,
        handlers: [
            {
                name: 'fileToken',
                methodName: 'handlerInit'
            }
        ]
    },
    {
        cls: require('../handlers/file.upload.handler').default,
        handlers: [
            {
                name: 'fileUpload',
                methodName: 'handlerInit'
            }
        ]
    }

];

export default services;