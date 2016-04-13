const schema = require('../schema/store.schema');
const PayloadValidator = require('./payload.validation');

module.exports = [
    {
        method: 'GET',
        path: '/stores',
        config: {
            handler: {
                crudGetAll: {
                    collectionName: schema.collectionName,
                    schema: schema.schema,
                }
            },
            plugins: {
                hal: {
                    embedded: {
                        result: {
                            path: 'results',
                            href: './{item._id}'
                        }
                    }
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/stores/{id}',
        config: {
            handler: {
                crudGet: {
                    collectionName: schema.collectionName,
                    schema: schema.schema,
                    idPath: 'params.id',
                    notFoundMessage: 'Store not found'
                }
            },
        }
    },
    {
        method: 'POST',
        path: '/stores',
        config: {
            pre: [
                {method: 'storeParentValidator(payload.parent)'}
            ],
            handler: {
                crudCreate: {
                    collectionName: schema.collectionName,
                    schema: schema.schema,
                    idExistsMessage: 'store exists'

                }
            },
            validate: {
                payload: PayloadValidator.createPayload
            }
        }
    },
    {
        method: 'PUT',
        path: '/stores/{id}',
        config: {
            pre: [
                {method: 'storeParentValidator(payload.parent)'}
            ],
            handler: {
                crudUpdate: {
                    collectionName: schema.collectionName,
                    schema: schema.schema,
                    idPath: 'params.id',
                    notFoundMessage: 'Whitelabel not found'
                }
            },
            validate: {
                payload: PayloadValidator.updatePayload
            }
        }
    },
    {
        method: 'DELETE',
        path: '/stores/{id}',
        config: {
            handler: {
                crudRemove: {
                    collectionName: schema.collectionName,
                    schema: schema.schema,
                    idPath: 'params.id'
                }
            }
        }
    }

];