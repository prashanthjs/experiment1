module.exports = [
    {
        cls: require('../services/role.db.service').default,
        name: 'roleDbService'
    },
    {
        cls: require('../controllers/role.controller').default,
        methods: [
            {
                methodName: 'listAllPrivileges',
                name: 'listAllPrivileges'
            }
        ]
    },
    {
        cls: require('../services/role.validator').default,
        methods: [
            {
                methodName: 'roleValidator',
                name: 'roleValidator'
            },
            {
                methodName: 'privilegeValidator',
                name: 'privilegeValidator'
            }
        ]
    },
    {
        cls: require('../services/role.data').default
    }
];
