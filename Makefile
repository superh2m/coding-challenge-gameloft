# ==============================================================================
# Initialization ===============================================================

install: ## Installs the project
	sudo service docker start || true
	docker-compose build
	$(MAKE) npm CMD='install'
	$(MAKE) npm CMD='run install:pre-commit'
	$(MAKE) load_fixtures
	$(MAKE) start_dev

install_ci: ## Installs the project on CI
	sudo service docker start || true
	docker-compose build
	docker-compose run --rm --entrypoint sh web -c "npm install"
	docker-compose run --rm --entrypoint sh web -c "npm run install:pre-commit"
	docker-compose run --rm --entrypoint sh web -c "npm run load_fixtures"

# ==============================================================================
# Project updates tasks ========================================================
npm:
	docker-compose run --rm --user $$(id -u):$$(id -g) --entrypoint sh web -c "npm $(CMD)"

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
	docker-compose run --rm --user $$(id -u):$$(id -g) --service-ports --entrypoint sh web -c 'npm run dev'

run_in_background:
	$(MAKE) stop || true
	$(MAKE) build
	docker-compose up -d

stop:
	@docker-compose stop
