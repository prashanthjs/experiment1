const schema = require('../schema/category.schema');
const PayloadValidator = require('./payload.validation');

module.exports = [
    {
        method: 'GET',
        path: '/categories',
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
        path: '/categories/{id}',
        config: {
            handler: {
                crudGet: {
                    collectionName: schema.collectionName,
                    schema: schema.schema,
                    idPath: 'params.id',
                    notFoundMessage: 'category not found'
                }
            },
        }
    },
    {
        method: 'POST',
        path: '/categories',
        config: {
            pre: [
                {method: 'categoryParentValidator(payload.parentCategory)'}
            ],
            handler: {
                crudCreate: {
                    collectionName: schema.collectionName,
                    schema: schema.schema,
                    idExistsMessage: 'category exists'

                }
            },
            validate: {
                payload: PayloadValidator.createPayload
            }
        }
    },
    {
        method: 'PUT',
        path: '/categories/{id}',
        config: {
            pre: [
                {method: 'categoryParentValidator(payload.parentCategory)'}
            ],
            handler: {
                crudUpdate: {
                    collectionName: schema.collectionName,
                    schema: schema.schema,
                    idPath: 'params.id',
                    notFoundMessage: 'Category not found'
                }
            },
            validate: {
                payload: PayloadValidator.updatePayload
            }
        }
    },
    {
        method: 'DELETE',
        path: '/categories/{id}',
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