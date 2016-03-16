var addressSchema = {
    addressLine1: {
        type: String,
        require: true
    },
    addressLine2: {
        type: String,
        require: false
    },
    town: {
        type: String,
        require: true
    },
    county: {
        type: String,
        require: false
    },
    country: {
        type: String,
        require: false
    },
    postcode: {
        type: String,
        require: true
    }
};
