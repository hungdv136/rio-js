import axios from 'axios'
import { v4 as uuidv4 } from 'uuid';
import { Server } from '../sdk/server'; 
import { Stub } from '../sdk/stub'; 
import { Rule } from '../sdk/matching-rule';
import { JSONResponse } from '../sdk/response';

// Your checkout API
const checkoutURL =  'http://localhost:8808/checkout';
const mockServer = new Server('http://localhost:8896');

describe('test /checkout using raw JSON to create stub', () => {
  // Create random data
  const validCardNumber = uuidv4();
  const invalidCardNumber = uuidv4(); 
  const expectedId = uuidv4();


  beforeAll(async () => {
    try {
      await mockServer.clearStubs();
      
      // Create a stub which matches method, url and request body (stubs -> request)
      const stub = {
        request: {
          method: 'POST',
          url: [{
              name: 'contains',
              value: '/pay'
          }],
          body: [{
            content_type: 'application/json',
            operator: {
              name: 'equal_to',
              value: validCardNumber
            },
            key_path: '$.cardNumber'
          }] 
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
    } catch(error) {
      console.log('setup error: ', error);
    }
  })

  it('card number is matched, return predefined body in stub', async () => {
    const params = { cardNumber: validCardNumber, amount: 30000}
    const { data, status } = await axios.post(checkoutURL, params);
    expect(status).toBe(200)
    expect(data.response.id.length).not.toBe(0); 
    expect(data.response.id).toBe(expectedId)
  });

  it('card number is not matched, no response from 3rd party', async () => {
    const params = { cardNumber: invalidCardNumber, amount: 30000}
    const { data, status } = await axios.post(checkoutURL, params);
    expect(status).toBe(200)
    expect(data.response).toBeUndefined()
  });
});

describe('test /checkout using SDK to create stub', () => {
  // Create random data
  const validCardNumber = uuidv4();
  const invalidCardNumber = uuidv4(); 
  const expectedId = uuidv4();


  beforeAll(async () => {
    try {
      await mockServer.clearStubs();
      
      // Create a stub which matches method, url and request body (stubs -> request)
      const stub = new Stub('POST', Rule.contains('/pay'))
      .withRequestBodyJSONPath('$.cardNumber', Rule.equalsTo(validCardNumber))
      .withRequestBodyJSONPath('$.amount', Rule.equalsTo(30000))
      .willReturn(JSONResponse({id: expectedId}))
      .send(mockServer)

      await mockServer.createStub(stub);
    } catch(error) {
      console.log('setup error: ', error);
    }
  })

  it('card number is matched, return predefined body in stub', async () => {
    const params = { cardNumber: validCardNumber, amount: 30000}
    const { data, status } = await axios.post(checkoutURL, params);
    expect(status).toBe(200)
    expect(data.response.id.length).not.toBe(0); 
    expect(data.response.id).toBe(expectedId)
  });

  it('card number is not matched, no response from 3rd party', async () => {
    const params = { cardNumber: invalidCardNumber, amount: 30000}
    const { data, status } = await axios.post(checkoutURL, params);
    expect(status).toBe(200)
    expect(data.response).toBeUndefined()
  });
});