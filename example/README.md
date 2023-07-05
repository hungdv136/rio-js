# Examples for using Rio to write integration test

- [Examples for using Rio to write integration test](#examples-for-using-rio-to-write-integration-test)
  - [Install](#install)
  - [Setup](#setup)
  - [Write tests](#write-tests)
    - [Manual tests](#manual-tests)
    - [Write automation tests](#write-automation-tests)
  - [Debug](#debug)

## Install

- Docker
- NodeJS: 18+

## Setup

Suppose that you are trying to write integration test for your API `POST /checkout` which depends on an external payment API `/pay`. To make it simple, this API forwards request to 3rd party API, then returns responded data from 3rd party back to the caller. See [example/index.ts](server/index.ts) for more details. 

Run the below command to start Rio and your example API server before running your test suites

```bash
make up
```

Verify whether your test API is ready 

```bash
curl http://localhost:8808/ping
```

Verify whether Rio is ready 

```bash
curl http://localhost:8896/ping
```

In the real world scenario, you don't need to setup these steps because your API and mock server (Rio) are already deployed in testing environment. Instead, you need to configure the root URL of 3rd party API to Rio mock server

## Write tests

### Manual tests

Reset all stubs 

```bash
curl -X DELETE http://localhost:8896/reset?namespace=reset_all
```

Submit a stub to mock

```bash
curl --location 'http://localhost:8896/stub/create_many' \
--header 'Content-Type: application/json' \
--data '{
  "stubs": [
    {
      "request": {
        "method": "POST",
        "url": [
          {
            "name": "contains",
            "value": "/pay"
          }
        ]
      },
      "response": {
        "status_code": 200,
        "header": {
          "Content-Type": "application/json"
        },
        "body": {
          "id": "bfd4ea04-f2ad-444b-b672-9b739d0546fc",
          "createdAt": "2023-07-03T08:17:24Z"
        }
      },
      "active": true
    }
  ]
}'
```

Perform a CURL to test to API 

```bash
curl --location 'http://localhost:8808/checkout' \
--header 'Content-Type: application/json' \
--data '{
    "cardNumber": "123456789",
    "amount": 30000
}'
```

### Write automation tests

See [example](example/checkout.test.ts)

```bash
make test
```

## Debug

- Get Rio's logs: `make rio-logs`

- List defined stubs: `curl http://localhost:8896/stub/list`

- List of receiving requests: `curl -X POST http://localhost:8896/incoming_request/list`

- Cleanup environment: `make rio-down`
