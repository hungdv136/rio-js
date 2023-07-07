import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { Server } from '../sdk/server';

// Your checkout API, read README.md file to start dependencies
const checkoutURL = 'http://localhost:8808/checkout';
const mockServer = new Server('http://localhost:8896');

describe('test /checkout using raw JSON to create stub', () => {
  it('card number is matched, return predefined body in stub', async () => {
    // Create random data
    const validCardNumber = uuidv4();
    const expectedId = uuidv4();

    // Create a stub which matches method, url and request body (stubs -> request)
    const stub = {
      request: {
        method: 'POST',
        url: [
          {
            name: 'contains',
            value: '/pay'
          }
        ],
        body: [
          {
            content_type: 'application/json',
            operator: {
              name: 'equal_to',
              value: validCardNumber
            },
            key_path: '$.cardNumber'
          }
        ]
      },
      response: {
        status_code: 200,
        header: {
          'Content-Type': 'application/json'
        },
        body: {
          id: expectedId,
          createdAt: '2023-07-03T08:17:24Z'
        }
      },
      active: true
    };

    await mockServer.createStub(stub);

    const params = { cardNumber: validCardNumber, amount: 30000 };
    const { data, status } = await axios.post(checkoutURL, params);
    expect(status).toBe(200);
    expect(data.response.id.length).not.toBe(0);
    expect(data.response.id).toBe(expectedId);
  });

  it('card number is not matched, no response from 3rd party', async () => {
    const invalidCardNumber = uuidv4();

    const params = { cardNumber: invalidCardNumber, amount: 30000 };
    const { data, status } = await axios.post(checkoutURL, params);
    expect(status).toBe(200);
    expect(data.response).toBeUndefined();
  });
});
