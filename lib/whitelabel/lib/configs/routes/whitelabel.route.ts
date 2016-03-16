const schema = require('../schema/whitelabel.schema');
const PayloadValidator = require('./payload.validation');

module.exports = [
    {
        method: 'GET',
        path: '/whitelabels',
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
        path: '/whitelabels/{id}',
        config: {
            handler: {
                crudGet: {
                    collectionName: schema.collectionName,
                    schema: schema.schema,
                    idPath: 'params.id',
                    notFoundMessage: 'Whitelabel not found'
                }
            },
        }
    },
    {
        method: 'POST',
        path: '/whitelabels',
        config: {
            pre: [
                {method: 'whitelabelParentValidator(payload.parent)'}
            ],
            handler: {
                crudCreate: {
                    collectionName: schema.collectionName,
                    schema: schema.schema,
                    idExistsMessage: 'Whitelabel exists'

                }
            },
            validate: {
                payload: PayloadValidator.createPayload
            }
        }
    },
    {
        method: 'PUT',
        path: '/whitelabels/{id}',
        config: {
            pre: [
                {method: 'whitelabelParentValidator(payload.parent)'}
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
        path: '/whitelabels/{id}',
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