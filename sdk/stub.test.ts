import { Stub } from './stub';
import { Rule } from './matching-rule';

describe('Stub', () => {
  it('serializing', () => {
    const stub = new Stub()
      .withDescription('example stub')
      .withWeight(10)
      .withNamespace('example ns')
      .shouldDelay(2)
      .withHeader('X-REQUEST-ID', Rule.equalsTo('<id>'))
      .withHeader('Authorization', Rule.contains('<token>'))
      .withQuery('request-id', Rule.notContains('<request-id>'))
      .withCookie('session-id', Rule.notContains('<session-id>'))
      .withRequestBodyJSONPath('$.name', Rule.equalsTo('<body json field>'));

    expect(stub.toJSON()).toBe('');
  });
});
