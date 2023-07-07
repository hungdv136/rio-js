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
  it('card number is matched, return predefined body in stub', async () => {
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

  it('card number is not matched, no response from 3rd party', async () => {
    const invalidCardNumber = uuidv4();
    const params = { cardNumber: invalidCardNumber, amount: 30000 };
    const { data, status } = await axios.post(checkoutURL, params);
    expect(status).toBe(200);
    expect(data.response).toBeUndefined();
  });

  it('dynamic response', async () => {
    // Create a stub to test dynamic response
    const res = JSONResponse({});
    res.template = new Template();
    res.template.script = `
    status_code: 201

    cookies:
        {{ range $cookie := .Request.Cookies }}
        - name: {{ $cookie.Name }}
          value: {{ $cookie.Value }}
        {{end}}

    headers:
        X-REQUEST-ID: {{ .Request.Header.Get "X-REQUEST-ID"}}

    body: >
        {
            "encrypted_value": "{{ encryptAES "e09b3cc3b4943e2558d1882c9ef999eb" .JSONBody.naked_value}}"
        }
    `;

    await new Stub('POST', Rule.contains('/any_path'))
      .withDescription('dynamic response')
      .willReturn(res)
      .send(mockServer);

    const params = { naked_value: '123456789' };
    const { data, status } = await axios.post(
      'http://localhost:8896/echo/any_path',
      params
    );
    expect(status).toBe(201);
    expect(data.encrypted_value.length).toBe(44);
  });
});
