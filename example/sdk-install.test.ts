import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import {
  Server,
  Stub,
  JSONPathRule,
  Rule,
  JSONResponse,
  Template
} from 'rio-ts-sdk';

// Your checkout API, read README.md file to start dependencies
const checkoutURL = 'http://localhost:8808/checkout';
const mockServer = new Server('http://localhost:8896');

describe('installing sdk from npm', () => {
  test('card number is matched, return predefined body in stub', async () => {
    // Create random data
    const validCardNumber = uuidv4();
    const expectedId = uuidv4();

    // Create a stub which matches method, url and request body (stubs -> request)
    await new Stub('POST', Rule.contains('/pay'))
      .withDescription('stub from sdk')
      .withRequestBody(
        JSONPathRule('$.cardNumber', Rule.equalsTo(validCardNumber)),
        JSONPathRule('$.amount', Rule.equalsTo(30000))
      )
      .willReturn(JSONResponse({ id: expectedId }))
      .send(mockServer);

    const params = { cardNumber: validCardNumber, amount: 30000 };
    const { data, status } = await axios.post(checkoutURL, params);
    expect(status).toBe(200);
    expect(data.response.id.length).not.toBe(0);
    expect(data.response.id).toBe(expectedId);
  });

  test('card number is not matched, no response from 3rd party', async () => {
    const invalidCardNumber = uuidv4();
    const params = { cardNumber: invalidCardNumber, amount: 30000 };
    const { data, status } = await axios.post(checkoutURL, params);
    expect(status).toBe(200);
    expect(data.response).toBeUndefined();
  });
});
