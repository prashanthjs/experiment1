"use strict";
var services = [
    {
        cls: require('../services/document.service.factory').default,
        name: 'documentServiceFactory',
    },
    {
        cls: require('../handlers/crud.factory.handler').default,
        handlers: [
            {
                name: 'crudGetAll',
                methodName: 'handlerGetAll'
            },
            {
                name: 'crudGet',
                methodName: 'handlerGet'
            },
            {
                name: 'crudUpdate',
                methodName: 'handlerUpdate'
            },
            {
                name: 'crudCreate',
                methodName: 'handlerCreate'
            },
            {
                name: 'crudRemove',
                methodName: 'handlerRemove'
            }
        ]
    }
];
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = services;
