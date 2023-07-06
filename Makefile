
# A single command to start API server and mock server
example-up:
	@docker compose -f docker/compose.yaml up -d
	@(cd example/server && npm install)
	@(cd example/server && npm run build)
	@(cd example/server && npm run dev)
.PHONY: example-up

# Start Rio and its dependencies (SQL)
rio-up:
	@docker compose -f docker/compose.yaml up -d
.PHONY: rio-up

# Cleanup test environment
rio-down:
	@docker compose -f docker/compose.yaml down
.PHONY: rio-down

# Show docker compose logs
rio-logs:
	@docker compose -f docker/compose.yaml logs
.PHONY: rio-logs

# Start API server to simulate test target API
server-up:
	@(cd example/server && npm install)
	@(cd example/server && npm run build)
	@(cd example/server && npm run dev)
.PHONY: server-up

# Run example integration tests
example-test:
	@(cd example && npm install)
	@(cd example && npm test)
.PHONY: example-test

sdk-install:
	@(cd sdk && npm install)
.PHONY: sdk-install

sdk-build:
	@(cd sdk && rm -R -f dist)
	@(cd sdk && npm run build)
.PHONY: sdk-build

# Run test for SDK
sdk-test:
	@(cd sdk && npm test)
.PHONY: sdk-test

sdk-format:
	@(cd sdk && npm run format)
.PHONY: sdk-format

sdk-lint:
	@(cd sdk && npm run lint)
.PHONY: sdk-lint