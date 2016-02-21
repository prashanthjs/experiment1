var DbParser = (function () {
    function DbParser(schema) {
        this.schema = schema;
    }
    DbParser.prototype.parse = function (options) {
        this.page = 1;
        if (options.page) {
            var page = options.page;
            if (typeof page === 'string') {
                this.page = parseInt(page);
            }
            else {
                this.page = page;
            }
        }
        this.skip = 0;
        if (options.skip) {
            var skip = options.skip;
            if (typeof skip === 'string') {
                this.skip = parseInt(skip);
            }
            else {
                this.skip = skip;
            }
        }
        this.pageSize = 1000;
        if (options.pageSize) {
            var pageSize = options.pageSize;
            if (typeof pageSize === 'string') {
                this.pageSize = parseInt(pageSize);
            }
            else {
                this.pageSize = pageSize;
            }
        }
        this.filter = {};
        if (options.filter) {
            var filters = options.filter;
            if (typeof filters === 'string') {
                this.filter = this.parseAndReturnFilters(JSON.parse(filters));
            }
            else {
                this.filter = this.parseAndReturnFilters(filters);
            }
        }
        this.sort = {};
        if (options.sort) {
            var sort = options.sort;
            if (typeof sort === 'string') {
                this.sort = this.parseAndReturnSort(JSON.parse(sort));
            }
            else {
                this.sort = this.parseAndReturnSort(sort);
            }
        }
    };
    DbParser.prototype.parseAndReturnFilters = function (filters, logic) {
        if (logic === void 0) { logic = 'and'; }
        var ret = {};
        var tempFilters = [];
        if (!(filters instanceof Array)) {
            tempFilters[0] = filters;
        }
        else {
            tempFilters = filters;
        }
        var temp = [];
        for (var i = 0; i < tempFilters.length; i++) {
            if (tempFilters[i].filters) {
                temp.push(this.parseAndReturnFilters(tempFilters[i].filters, tempFilters[i].logic));
            }
            else {
                temp.push(this.parseAndReturnFilter(tempFilters[i]));
            }
        }
        ret['$' + logic] = temp;
        return ret;
    };
    DbParser.prototype.parseAndReturnFilter = function (filter) {
        var temp = {};
        temp[filter.field] = this.parseAndReturnValue(filter.field, filter.value, filter.operator);
        return temp;
    };
    DbParser.prototype.parseAndReturnSort = function (sorts) {
        var ret = {};
        var tempSorts = [];
        if (!(sorts instanceof Array)) {
            tempSorts[0] = sorts;
        }
        else {
            tempSorts = sorts;
        }
        for (var i = 0; i < tempSorts.length; i++) {
            ret[tempSorts[i].field] = tempSorts[i].dir;
        }
        return ret;
    };
    DbParser.prototype.getParsedObject = function (key) {
        var field = this.schema.path(key);
        if (field && field.options) {
            return field.options;
        }
        return false;
    };
    DbParser.prototype.getType = function (field) {
        var obj = this.getParsedObject(field);
        var type = 'none';
        if (obj) {
            switch (obj.type) {
                case String:
                    type = 'string';
                    break;
                case Number:
                    type = 'number';
                    break;
                case Date:
                    type = 'date';
                    break;
                case Boolean:
                    type = 'boolean';
                    break;
                default:
                    type = 'none';
                    break;
            }
        }
        return type;
    };
    DbParser.prototype.parseAndReturnValue = function (field, value, operator) {
        if (operator === void 0) { operator = 'eq'; }
        var type = this.getType(field);
        switch (operator) {
            case 'contains':
                value = { $regex: new RegExp(value, 'i') };
                break;
            case 'doesnotcontain':
                value = { $ne: { $regex: new RegExp(value, 'i') } };
                break;
            case 'startswith':
                value = { $regex: new RegExp('^' + value, 'i') };
                break;
            case 'endswith':
                value = { $regex: new RegExp(value + '$', 'i') };
                break;
            case 'eq':
                if (type === 'string') {
                    value = { $regex: new RegExp('^' + value + '$', 'i') };
                }
                break;
            case 'ne':
                value = { $ne: value };
                break;
            case 'gt':
                value = { $gt: value };
                break;
            case 'gte':
                value = { $gte: value };
                break;
            case 'lt':
                value = { $lt: value };
                break;
            case 'lte':
                value = { $lte: value };
                break;
            default:
                break;
        }
        return value;
    };
    return DbParser;
})();
exports.DbParser = DbParser;
var FactoryClass = (function () {
    function FactoryClass() {
        this.getDbParser = function (schema) {
            var dbParser = new DbParser(schema);
            return dbParser;
        };
    }
    return FactoryClass;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FactoryClass;
