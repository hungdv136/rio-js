# Typescript SDK for Rio HTTP mocking

This is TypeScript SDK for [Rio](https://github.com/hungdv136/rio) HTTP/gRPC mock

## Prerequisites

- NodeJS v18+
- Rio mock server v1.2.3+: See [example](../example/README.md) to how to deploy locally

## How to use 

```bash
npm install rio-ts-sdk
```

Avaliable features/syntax are documented in [Rio](httts://github.com/hungdv136/rio)

## Examples

1. Build stub using SDK

```ts
import { Rule, JSONPathRule, JSONResponse, Stub } from 'rio-ts-sdk';

const mockServer = new Server('http://localhost:8896');

it('checkout API', () => {
    const validCardNumber = uuidv4();
    const expectedId = uuidv4();

    // Submit a stub to simulate 3rd party response
    // The mock server will match method, url and body (cardNumber and amount)
    // If these are matched with incoming requests, then mock server responds JSON data
    await new Stub('POST', Rule.contains('/pay'))
        .withDescription('stub for mocking pay API')
        .withRequestBody(
            JSONPathRule('$.cardNumber', Rule.equalsTo(validCardNumber)),
            JSONPathRule('$.amount', Rule.equalsTo(30000))
        )
        .willReturn(JSONResponse({id: expectedId, amount: 30000}))
        .send(mockServer);
    
    // Your test case
    const params = { cardNumber: validCardNumber, amount: 30000}
    const { data, status } = await axios.post('https://your-server.com/checkout', params);
    expect(status).toBe(200)
    expect(data.response.id).toBe(expectedId)
});
```

See [example](../example/checkout-sdk.test.ts) for end to end example

2. Dynamic Response

This illustrates how to write dynamic response. This is helpful for manual testing. If you are writing integration tests by JS/TS, **it is recommended** to build response using JS/TS SDK since it is more flexible and also easier to debug

```ts
    // The response can be built programmatically based on the request 
    // - .Request.XXX (Cookies, Header, ..)
    // - .JSONBody.<json_field_name>.<json_field_name_child>
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
```

See [example](../example/sdk-install.test.ts) for end to end example of dynamic response

## Development

Run the below command at project root to run unit test

```bash
make sdk-test
```

Before commit code, run this command to format code and check lint

```bash
make sdk-all
```
