# Typescript SDK for Rio HTTP mocking

## Examples

```ts
import { Stub } from './stub';
import { JSONResponse } from './response';
import { Rule } from './matching-rule';

const mockServer = new Server('http://localhost:8896');

it('checkout API', () => {
    const validCardNumber = uuidv4();
    const expectedId = uuidv4();

    // Submit a stub to mock server
    await new Stub()
        .withDescription('stub for mocking pay API')
        .withRequestBodyJSONPath('$.cardNumber', Rule.equalsTo(validCardNumber))
        .withRequestBodyJSONPath('$.amount', Rule.equalsTo(30000))
        .willReturn(JSONResponse({id: expectedId}))
        .send(mockServer);
    
    // Your test
    const params = { cardNumber: validCardNumber, amount: 30000}
    const { data, status } = await axios.post(checkoutURL, params);
    expect(status).toBe(200)
    expect(data.response.id).toBe(expectedId)
});
```

See [example](../example/) for end to end example