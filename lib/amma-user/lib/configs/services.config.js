"use strict";
var services = [
    {
        cls: require('../services/user.encrypt.password').default,
        methods: [
            {
                methodName: 'encryptPassword',
                name: 'encryptPassword'
            },
            {
                methodName: 'encryptPasswordRequest',
                name: 'encryptPasswordRequest'
            }
        ]
    },
    {
        cls: require('../services/user.db.service').default,
        name: 'userDbService'
    },
    {
        cls: require('../services/user.email.unique.validator').default,
        methods: [
            {
                methodName: 'userEmailUniqueValidator',
                name: 'userEmailUniqueValidator'
            }
        ]
    },
];
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = services;
