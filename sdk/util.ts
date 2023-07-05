import lodash from 'lodash';

export function camelCaseToSnakeCase(obj: any): any {
  const clonedObj = lodash.mapKeys(lodash.cloneDeep(obj), (v, k) => {
    return lodash.snakeCase(k);
  });

  return lodash.mapValues(clonedObj, (value) => {
    if (isArray(value)) {
      return lodash.map(value, camelCaseToSnakeCase);
    } else if (isObject(value)) {
      return camelCaseToSnakeCase(value);
    } else {
      return value;
    }
  });
}

function isObject(o: any) {
  return o === Object(o) && !isArray(o) && typeof o !== 'function';
}

function isArray(a: any) {
  return Array.isArray(a);
}
