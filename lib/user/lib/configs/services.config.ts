module.exports = [
    {
        cls: require('../services/user.encrypt.password').default,
        methods: [
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
        cls: require('../services/auth.service').default,
        name: 'authService'
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

    {
        cls: require('../controllers/user.controller').default,
        methods: [
            {
                methodName: 'login',
                name: 'authLogin'
            },
            {
                methodName: 'logout',
                name: 'authLogout'
            },
            {
                methodName: 'updatePassword',
                name: 'userChangePassword'
            }
        ]
    },
    {
        cls: require('../services/user.data').default
    }

];