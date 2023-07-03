# Use Rio as a mock server to test Rest API

- [Use Rio as a mock server to test Rest API](#use-rio-as-a-mock-server-to-test-rest-api)
  - [Introduction](#introduction)
  - [Why mock?](#why-mock)
  - [Install](#install)
  - [Start API server](#start-api-server)
  - [Write your tests](#write-your-tests)
    - [Manual tests](#manual-tests)
    - [Write automation tests](#write-automation-tests)
  - [Debug](#debug)

## Introduction

Assume you want to write integration tests for an API which is dependent on 3rd party API as the below diagram. This repository provides examples how to use [Rio](https://github.com/hungdv136/rio) as mock server to mock dependent HTTP/gRPC systems

![Component](docs/component.png)

***Note:*** This is not for mocking dependency for unit test in a JS based application

## Why mock?

- Create a stable test suites by isolating your system with 3rd parties
- Able to verify diversed scenario

## Install

- Docker
- NodeJS: 18+

## Start API server

Assume that you are trying to write integration test for your API `POST /checkout` which depends on an external API for payment. To make it simple, this API forwards request to 3rd party API, then returns responded data from 3rd party back to the caller. See [Index](src/server/index.ts) for more details. Run the below command to start Rio and your example API server before running your test suites

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

## Write your tests

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

- TBD

## Debug

- Get Rio's logs: `make rio-logs`

- List defined stubs: `curl http://localhost:8896/stub/list`

- List of receiving requests: `curl -X POST http://localhost:8896/incoming_request/list`

- Cleanup environment: `make rio-down`
