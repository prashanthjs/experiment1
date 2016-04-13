var UserSchema = require('../schema/user.schema');
var UserPayloadValidator = require('./payload.validation');
module.exports = [
    {
        method: 'GET',
        path: '/users',
        config: {
            handler: {
                crudGetAll: {
                    collectionName: UserSchema.collectionName,
                    schema: UserSchema.schema,
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
        path: '/users/{id}',
        config: {
            handler: {
                crudGet: {
                    collectionName: UserSchema.collectionName,
                    schema: UserSchema.schema,
                    idPath: 'params.id',
                    notFoundMessage: 'User not found'
                }
            },
        }
    },
    {
        method: 'POST',
        path: '/users',
        config: {
            handler: {
                crudCreate: {
                    collectionName: UserSchema.collectionName,
                    schema: UserSchema.schema,
                    idExistsMessage: 'User exists'
                }
            },
            validate: {
                payload: UserPayloadValidator.createPayload
            }
        }
    },
    {
        method: 'PUT',
        path: '/users/{id}',
        config: {
            pre: [],
            handler: {
                crudUpdate: {
                    collectionName: UserSchema.collectionName,
                    schema: UserSchema.schema,
                    idPath: 'params.id',
                    notFoundMessage: 'User not found'
                }
            },
            validate: {
                payload: UserPayloadValidator.updatePayload
            }
        }
    },
    {
        method: 'DELETE',
        path: '/users/{id}',
        config: {
            handler: {
                crudRemove: {
                    collectionName: UserSchema.collectionName,
                    schema: UserSchema.schema,
                    idPath: 'params.id'
                }
            }
        }
    }
];
