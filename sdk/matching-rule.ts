// All matching rules
export class RequestMatching {
  // Request method GET, POST, PUT, DELETE, PATCH
  method: string;

  // Rules to match the url
  url: Rule[];

  // Rules to match header name
  header: FieldRule[];

  // Rules to match cookie
  cookie: FieldRule[];

  // Rules to match request query
  query: FieldRule[];

  // Rules to match request body by xml or json path
  body: BodyRule[];

  constructor() {
    this.url = [];
    this.header = [];
    this.cookie = [];
    this.query = [];
    this.body = [];
  }
}

export class Rule {
  // One of the following values
  //  - "contains"
  //  - "not_contains"
  //  - "regex"
  //  - "equal_to"
  //  - "start_with"
  //  - "end_with"
  //  - "length"
  //  - "empty"
  //  - "not_empty"
  name: string;

  // Expected value which will be compared with appropriate value from incoming requests
  value?: any;

  constructor(name: string, value?: any) {
    this.name = name;
    this.value = value;
  }

  static contains(v: string | []) {
    return new Rule('contains', v);
  }

  static equalsTo(value: any) {
    return new Rule('equal_to', value);
  }

  static notContains(value: string | []) {
    return new Rule('not_contains', value);
  }

  static regex(regex: string) {
    return new Rule('regex', regex);
  }

  static startWith(prefix: string) {
    return new Rule('start_with', prefix);
  }

  static endWith(postfix: string) {
    return new Rule('end_with', postfix);
  }

  static withLength(value: number) {
    return new Rule('length', value);
  }

  static empty() {
    return new Rule('empty');
  }

  static notEmpty() {
    return new Rule('not_empty');
  }
}

export interface FieldRule {
  fieldName: string;
  operator: Rule;
}

export interface BodyRule {
  // One of the following values
  //  - "application/json"
  //  - "text/xml"
  //  - "text/html"
  //  - "text/plain"
  //  - "multipart/form-data"
  //  - "application/x-www-form-urlencoded"
  contentType: string;

  // Rule to match against incoming requests
  operator: Rule;

  // JSONPath or XPath
  // Refer to this document for json path syntax https://goessner.net/articles/JsonPath/
  keyPath: string;
}

// Matches request body by JSON Path
// Refer to this document for json path syntax https://goessner.net/articles/JsonPath/
// Example: new Stub().withRequestBody(JSONPathRule('$.level1.level2', Rule.equalsTo('<expected-value>')))
export function JSONPathRule(keyPath: string, rule: Rule): BodyRule {
  return {
    contentType: 'application/json',
    keyPath: keyPath,
    operator: rule
  };
}

// Matches request body by form field in multiple parts request
// Example: new Stub().withRequestBody(MultiPartFormRule('<fiel-name>', Rule.contains('<expected-value>')))
export function MultiPartFormRule(keyPath: string, rule: Rule): BodyRule {
  return {
    contentType: 'multipart/form-data',
    keyPath: keyPath,
    operator: rule
  };
}

// Verifies form value in url encoded request
// Example: new Stub().withRequestBody(URLEncodedBodyRule('<fiel-name>', Rule.notEmpty()))
export function URLEncodedBodyRule(keyPath: string, rule: Rule) {
  return {
    contentType: "application/x-www-form-urlencoded",
    keyPath: keyPath,
    operator: rule
  };
}
