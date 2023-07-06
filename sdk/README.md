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

    // Submit a stub to simulate 3rd party response
    await new Stub()
        .withDescription('stub for mocking pay API')
        .withRequestBody(
            JSONPathRule('$.cardNumber', Rule.equalsTo(validCardNumber)),
            JSONPathRule('$.amount', Rule.equalsTo(30000))
        )
        .willReturn(JSONResponse({id: expectedId, amount: 30000}))
        .send(mockServer);
    
    // Your test case
    const params = { cardNumber: validCardNumber, amount: 30000}
    const { data, status } = await axios.post(checkoutURL, params);
    expect(status).toBe(200)
    expect(data.response.id).toBe(expectedId)
});
```

See [example](../example/checkout-sdk.test.ts) for end to end example