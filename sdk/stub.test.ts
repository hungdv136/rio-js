import { Stub } from './stub';
import { MultiPartFormRule, Rule, URLEncodedBodyRule } from './matching-rule';
import { JSONResponse } from './response';

describe('end to end test stub', () => {
  it('json request body', () => {
    const expectedJSON = JSON.parse(`{
      "request": {
        "url": [
          {
            "name": "contains",
            "value": "/animal"
          }
        ],
        "header": [
          {
            "field_name": "X-REQUEST-ID",
            "operator": {
              "name": "equal_to",
              "value": "<id>"
            }
          },
          {
            "field_name": "Authorization",
            "operator": {
              "name": "contains",
              "value": "<token>"
            }
          }
        ],
        "cookie": [
          {
            "field_name": "session-id",
            "operator": {
              "name": "not_contains",
              "value": "<session-id>"
            }
          }
        ],
        "query": [
          {
            "field_name": "request-id",
            "operator": {
              "name": "not_contains",
              "value": "<request-id>"
            }
          }
        ],
        "body": [
          {
            "content_type": "application/json",
            "key_path": "$.name",
            "operator": {
              "name": "equal_to",
              "value": "<body json field>"
            }
          }
        ],
        "method": "GET"
      },
      "active": true,
      "description": "example stub",
      "weight": 10,
      "namespace": "example ns",
      "settings": {
        "delay_duration": 2000000
      },
      "proxy": {
        "target_url": "http://payment",
        "enable_record": true
      }
    }`);

    const stub = new Stub('GET', Rule.contains('/animal'))
      .withDescription('example stub')
      .withWeight(10)
      .withNamespace('example ns')
      .shouldDelay(2)
      .withHeader('X-REQUEST-ID', Rule.equalsTo('<id>'))
      .withHeader('Authorization', Rule.contains('<token>'))
      .withQuery('request-id', Rule.notContains('<request-id>'))
      .withCookie('session-id', Rule.notContains('<session-id>'))
      .withTargetURL('http://payment')
      .withEnableRecord(true)
      .withRequestBodyJSONPath('$.name', Rule.equalsTo('<body json field>'));

    expect(stub.toJSON()).toBe(JSON.stringify(expectedJSON));
  });

  it('multi-part request body', () => {
    const expectedJSON = JSON.parse(`{
      "request": {
        "url": [
          {
            "name": "contains",
            "value": "/animal"
          }
        ],
        "header": [],
        "cookie": [],
        "query": [],
        "body": [
          {
            "content_type": "multipart/form-data",
            "key_path": "fileName",
            "operator": {
              "name": "not_empty"
            }
          }
        ],
        "method": "GET"
      },
      "active": true,
      "description": "example stub"
    }`);

    const stub = new Stub('GET', Rule.contains('/animal'))
      .withDescription('example stub')
      .withRequestBody(MultiPartFormRule('fileName', Rule.notEmpty()));
    expect(stub.toJSON()).toBe(JSON.stringify(expectedJSON));
  });

  it('url-encoded-form-data', () => {
    const expectedJSON = JSON.parse(`{
      "request": {
        "url": [
          {
            "name": "contains",
            "value": "/animal"
          }
        ],
        "header": [],
        "cookie": [],
        "query": [],
        "body": [
          {
            "content_type": "application/x-www-form-urlencoded",
            "key_path": "fileName",
            "operator": {
              "name": "not_empty"
            }
          }
        ],
        "method": "GET"
      },
      "active": true,
      "description": "example stub"
    }`);

    const stub = new Stub('GET', Rule.contains('/animal'))
      .withDescription('example stub')
      .withRequestBody(URLEncodedBodyRule('fileName', Rule.notEmpty()));
    expect(stub.toJSON()).toBe(JSON.stringify(expectedJSON));
  });

  it('json response body', () => {
    const expectedJSON = JSON.parse(`{
      "request": {
        "url": [
          {
            "name": "contains",
            "value": "/animal"
          }
        ],
        "header": [],
        "cookie": [],
        "query": [],
        "body": [],
        "method": "POST"
      },
      "active": true,
      "response": {
        "body": {
          "cardNumber": "123456788",
          "amount": 30000
        },
        "header": {
          "Content-Type": "application/json",
          "header-field": "res-header-value"
        },
        "cookies":[
          {
            "name": "cookie-id",
            "value": "<res-cookie-value>",
            "expired_at": "2023-12-17T03:24:00.000Z"
          }
        ],
        "status_code":200
      }
    }`);

    const stub = new Stub('POST', Rule.contains('/animal')).willReturn(
      JSONResponse({ cardNumber: '123456788', amount: 30000 })
        .withCookie(
          'cookie-id',
          '<res-cookie-value>',
          new Date('2023-12-17T03:24:00.000Z')
        )
        .withHeader('header-field', 'res-header-value')
        .withStatusCode(200)
    );

    expect(stub.toJSON()).toBe(JSON.stringify(expectedJSON));
  });
});
