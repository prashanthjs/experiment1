module.exports = [
    {
        cls: require('../services/store.db.service').default,
        name: 'storeDbService'
    },
    {
        cls: require('../services/store.data').default
    },
    {
        cls: require('../services/store.validator').default,
        methods: [
            {
                methodName: 'storeValidator',
                name: 'storeValidator'
            }
        ]
    },
];
