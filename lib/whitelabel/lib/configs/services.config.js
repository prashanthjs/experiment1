module.exports = [
    {
        cls: require('../services/whitelabel.db.service').default,
        name: 'whitelabelDbService'
    },
    {
        cls: require('../services/whitelabel.validator').default,
        methods: [
            {
                methodName: 'parentChecker',
                name: 'whitelabelParentValidator'
            }
        ]
    },
];
