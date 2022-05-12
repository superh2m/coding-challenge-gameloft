# ==============================================================================
# Initialization ===============================================================

install: ## Installs the project
	sudo service docker start || true
	docker-compose build
	$(MAKE) npm CMD='install'
	$(MAKE) npm CMD='run install:pre-commit'
	$(MAKE) load_data
	$(MAKE) start_dev

# ==============================================================================
# Project updates tasks ========================================================
npm:
	docker-compose run --rm --entrypoint sh web -c "npm $(CMD)"

build:
	$(MAKE) npm CMD="run build"

load_fixtures:
	$(MAKE) npm CMD="run load_fixtures"

lint:
	$(MAKE) npm CMD="run lint"

test:
	$(MAKE) build
	$(MAKE) npm CMD="run pre:test"
	$(MAKE) npm CMD="run test"

# ==============================================================================
# Servers (and other long-running processes) management ========================
start_dev:
	sudo service docker start || true
	docker-compose up -d db
	docker-compose run --rm --service-ports --entrypoint sh web -c 'npm run dev'

run_in_background:
	$(MAKE) stop || true
	$(MAKE) build
	docker-compose up -d

stop:
	@docker-compose stop
