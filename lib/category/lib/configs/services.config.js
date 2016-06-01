module.exports = [
    {
        cls: require('../services/category.db.service').default,
        name: 'categoryDbService'
    },
    {
        cls: require('../services/category.validator').default,
        methods: [
            {
                methodName: 'parentChecker',
                name: 'categoryParentValidator'
            }
        ]
    },
];
