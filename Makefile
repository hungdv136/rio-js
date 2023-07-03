
# A single command to start API server and mock
up:
	@docker compose -f docker/compose.yaml up -d
	@(cd src/server && npm install)
	@(cd src/server && npm run build)
	@(cd src/server && npm run dev)
	
.PHONY: up

# Start Rio
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

# Start API server
server-up:
	@(cd src/server && npm install)
	@(cd && npm run build)
	@(cd && npm run dev)
.PHONY: server-up
