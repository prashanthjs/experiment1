var RoleSchema = require('../schema/role.schema');
var RolePayloadValidator = require('./payload.validation');
module.exports = [
    {
        method: 'GET',
        path: '/roles',
        config: {
            handler: {
                crudGetAll: {
                    collectionName: RoleSchema.collectionName,
                    schema: RoleSchema.schema,
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
        path: '/roles/{id}',
        config: {
            handler: {
                crudGet: {
                    collectionName: RoleSchema.collectionName,
                    schema: RoleSchema.schema,
                    idPath: 'params.id',
                    notFoundMessage: 'Role not found'
                }
            },
        }
    },
    {
        method: 'POST',
        path: '/roles',
        config: {
            pre: [
                { method: 'privilegeValidator(payload.privileges)' }
            ],
            handler: {
                crudCreate: {
                    collectionName: RoleSchema.collectionName,
                    schema: RoleSchema.schema,
                    idExistsMessage: 'Role exists'
                }
            },
            validate: {
                payload: RolePayloadValidator.createPayload
            }
        }
    },
    {
        method: 'PUT',
        path: '/roles/{id}',
        config: {
            pre: [
                { method: 'privilegeValidator(payload.privileges)' }
            ],
            handler: {
                crudUpdate: {
                    collectionName: RoleSchema.collectionName,
                    schema: RoleSchema.schema,
                    idPath: 'params.id',
                    notFoundMessage: 'Role not found'
                }
            },
            validate: {
                payload: RolePayloadValidator.updatePayload
            }
        }
    },
    {
        method: 'DELETE',
        path: '/roles/{id}',
        config: {
            handler: {
                crudRemove: {
                    collectionName: RoleSchema.collectionName,
                    schema: RoleSchema.schema,
                    idPath: 'params.id'
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/roles/get-all-privileges',
        config: {
            handler: 'listAllPrivileges'
        }
    }
];
