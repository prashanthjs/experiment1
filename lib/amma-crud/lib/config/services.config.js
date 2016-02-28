var services = [
    {
        cls: require('../services/document.service.factory').default,
        name: 'documentServiceFactory',
    },
    {
        cls: require('../handlers/crud.create.handler').default,
        handlers: [
            {
                name: 'crudCreate',
                methodName: 'handlerInit'
            }
        ]
    },
    {
        cls: require('../handlers/crud.get.all.handler').default,
        handlers: [
            {
                name: 'crudGetAll',
                methodName: 'handlerInit'
            }
        ]
    },
    {
        cls: require('../handlers/crud.get.handler').default,
        handlers: [
            {
                name: 'crudGet',
                methodName: 'handlerInit'
            }
        ]
    },
    {
        cls: require('../handlers/crud.remove.handler').default,
        handlers: [
            {
                name: 'crudRemove',
                methodName: 'handlerInit'
            }
        ]
    },
    {
        cls: require('../handlers/crud.update.handler').default,
        handlers: [
            {
                name: 'crudUpdate',
                methodName: 'handlerInit'
            }
        ]
    }
];
Object.defineProperty(exports, "__esModule", {value: true});
exports.default = services;
