
# A single command to start API server and mock server
up:
	@docker compose -f docker/compose.yaml up -d
	@(cd server && npm install)
	@(cd server && npm run build)
	@(cd server && npm run dev)
.PHONY: up

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
	@(cd server && npm install)
	@(cd && npm run build)
	@(cd && npm run dev)
.PHONY: server-up

# Run example integration tests
test:
	@(cd example && npm install)
	@(cd example && npm test)
.PHONY: test

sdk-install:
	@(cd sdk && npm install)
.PHONY: sdk-install

# Run test for SDK
sdk-test:
	@(cd sdk && npm test)
.PHONY: sdk-test

sdk-format:
	@(cd sdk && npm run format)
.PHONY: sdk-format:

sdk-lint:
	@(cd sdk && npm run lint)
.PHONY: sdk-lint: