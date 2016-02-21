import ObjectPath = require('object-path');
import Mongoose = require('mongoose');

export interface IFilter {
  field: string,
  operator?: string,
  value: any
}

export interface ISort {
  field: string,
  dir?: string
}

export interface IFilters {
  filter: IFilter[]|IFilter,
  logic?: string
}


export interface IOptions {
  filter?: string|IFilters[]|IFilters,
  page?: number|string,
  pageSize?: number|string,
  skip?: number|string,
  sort?: string|ISort[]|ISort,
  take?: number|string
}

export interface IDbParser {
    schema: Object;
    page: number;
    pageSize: number;
    sort: any;
    filter: any;
    skip: number;
    parse(options: IOptions): void;
    parseAndReturnFilters(filters: IFilters[] | IFilters, logic?: string): Object;
    parseAndReturnFilter(filter: IFilter): Object;
    parseAndReturnSort(sorts: ISort[] | ISort): Object;
    getParsedObject(field: string): any;
    getType(field: string): string;
    parseAndReturnValue(field: string, value: any, operator?: string): any;
}

export class DbParser  implements IDbParser{

  public page: number;
  public pageSize: number;
  public sort: any;
  public filter: any;
  public skip: number;

  constructor(public schema?: Mongoose.Schema) {
  }

  public parse(options: IOptions): void {
    this.page = 1;
    if (options.page) {
      let page = options.page;
      if (typeof page === 'string') {
        this.page = parseInt(page);
      } else {
        this.page = page;
      }
    }
    this.skip = 0;
    if (options.skip) {
      let skip = options.skip;
      if (typeof skip === 'string') {
        this.skip = parseInt(skip);
      } else {
        this.skip = skip;
      }
    }

    this.pageSize = 1000;
    if (options.pageSize) {
      let pageSize = options.pageSize;
      if (typeof pageSize === 'string') {
        this.pageSize = parseInt(pageSize);
      } else {
        this.pageSize = pageSize;
      }
    }
    this.filter = {};
    if (options.filter) {
      let filters = options.filter;
      if (typeof filters === 'string') {
        this.filter = this.parseAndReturnFilters(JSON.parse(filters));
      } else {
        this.filter = this.parseAndReturnFilters(filters);
      }
    }
    this.sort = {};
    if (options.sort) {
      let sort = options.sort;
      if (typeof sort === 'string') {
        this.sort = this.parseAndReturnSort(JSON.parse(sort));
      } else {
        this.sort = this.parseAndReturnSort(sort);
      }
    }

  }

  public parseAndReturnFilters(filters: IFilters[]|IFilters, logic = 'and'): Object {
    let ret = {};
    let tempFilters = [];
    if (!(filters instanceof Array)) {
      tempFilters[0] = filters;
    }
    else {
      tempFilters = filters;
    }
    let temp = [];
    for (let i = 0; i < tempFilters.length; i++) {
      if (tempFilters[i].filters) {
        temp.push(this.parseAndReturnFilters(tempFilters[i].filters, tempFilters[i].logic));
      }
      else {
        temp.push(this.parseAndReturnFilter(tempFilters[i]));
      }
    }
    ret['$' + logic] = temp;
    return ret;
  }

  public parseAndReturnFilter(filter: IFilter): Object {
    let temp = {};
    temp[filter.field] = this.parseAndReturnValue(filter.field, filter.value, filter.operator);
    return temp;
  }

  public parseAndReturnSort(sorts: ISort[]|ISort): Object {
    let ret = {};
    let tempSorts = [];
    if (!(sorts instanceof Array)) {
      tempSorts[0] = sorts;
    }
    else {
      tempSorts = sorts;
    }
    for (let i = 0; i < tempSorts.length; i++) {
      ret[tempSorts[i].field] = tempSorts[i].dir;
    }
    return ret;
  }

  public getParsedObject(key: string): any {
    let  field = this.schema.path(key);
    if(field && field.options){
      return field.options;
    }
    return false;
  }

  public getType(field: string): string {
    let obj = this.getParsedObject(field);
    let type = 'none';
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
  }

  public parseAndReturnValue(field: string, value: any, operator: string = 'eq'): any {
    let type = this.getType(field);
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
  }
}


export default class FactoryClass {

  getDbParser = (schema?: Mongoose.Schema): DbParser => {
    let dbParser = new DbParser(schema);
    return dbParser;
  }

}
