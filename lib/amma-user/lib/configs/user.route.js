"use strict";
var UserSchema = require('./user.schema');
var PayloadValidator = require('./validations/user.payload');
var routes = [
    {
        method: 'GET',
        path: '/users',
        config: {
            handler: {
                crudGetAll: {
                    collectionName: UserSchema.default.collectionName,
                    schema: UserSchema.default.schema,
                    projections: { password: 0 }
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
                    collectionName: UserSchema.default.collectionName,
                    schema: UserSchema.default.schema,
                    idPath: 'params.id',
                    notFoundMessage: 'User not found',
                    projections: { password: 0 }
                }
            },
        }
    },
    {
        method: 'POST',
        path: '/users',
        config: {
            pre: [
                { method: 'encryptPasswordRequest' },
                { method: 'userEmailUniqueValidator(payload.email)' }
            ],
            handler: {
                crudCreate: {
                    collectionName: UserSchema.default.collectionName,
                    schema: UserSchema.default.schema,
                    idExistsMessage: 'User Exists',
                    projections: { password: 0 }
                }
            },
            validate: {
                payload: PayloadValidator.default.createPayload
            }
        }
    },
    {
        method: 'PUT',
        path: '/users/{id}',
        config: {
            handler: {
                crudUpdate: {
                    collectionName: UserSchema.default.collectionName,
                    schema: UserSchema.default.schema,
                    idPath: 'params.id',
                    notFoundMessage: 'User not found',
                    projections: { password: 0 }
                }
            },
            validate: {
                payload: PayloadValidator.default.updatePayload
            }
        }
    },
    {
        method: 'DELETE',
        path: '/users/{id}',
        config: {
            handler: {
                crudRemove: {
                    collectionName: UserSchema.default.collectionName,
                    schema: UserSchema.default.schema,
                    idPath: 'params.id'
                }
            }
        }
    }
];
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = routes;
