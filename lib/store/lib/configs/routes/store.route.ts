const StoreSchema = require('../schema/store.schema');
const StorePayloadValidator = require('./payload.validation');

module.exports = [
    {
        method: 'GET',
        path: '/stores',
        config: {
            id: 'get-all-stores',
            handler: {
                crudGetAll: {
                    collectionName: StoreSchema.collectionName,
                    schema: StoreSchema.schema,
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
                    collectionName: StoreSchema.collectionName,
                    schema: StoreSchema.schema,
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
                {method: 'storeValidator(payload.parent)'}
            ],
            handler: {
                crudCreate: {
                    collectionName: StoreSchema.collectionName,
                    schema: StoreSchema.schema,
                    idExistsMessage: 'store exists'

                }
            },
            validate: {
                payload: StorePayloadValidator.createPayload
            }
        }
    },
    {
        method: 'PUT',
        path: '/stores/{id}',
        config: {
            pre: [
                {method: 'storeValidator(payload.parent)'}
            ],
            handler: {
                crudUpdate: {
                    collectionName: StoreSchema.collectionName,
                    schema: StoreSchema.schema,
                    idPath: 'params.id',
                    notFoundMessage: 'Store not found'
                }
            },
            validate: {
                payload: StorePayloadValidator.updatePayload
            }
        }
    },
    {
        method: 'DELETE',
        path: '/stores/{id}',
        config: {
            handler: {
                crudRemove: {
                    collectionName: StoreSchema.collectionName,
                    schema: StoreSchema.schema,
                    idPath: 'params.id'
                }
            }
        }
    }

];