.PHONY: up down build restart logs shell db-shell fresh key ps

up:
	cp -n .env.example .env 2>/dev/null || true
	docker compose up -d --build

down:
	docker compose down

build:
	docker compose build --no-cache

restart:
	docker compose restart $(s)

logs:
	docker compose logs -f

logs-backend:
	docker compose logs -f backend

shell:
	docker compose exec backend sh

db-shell:
	docker compose exec db mariadb -u$(shell grep DB_USERNAME .env | cut -d= -f2) \
		-p$(shell grep DB_PASSWORD .env | cut -d= -f2) \
		$(shell grep DB_DATABASE .env | cut -d= -f2)

fresh:
	docker compose down -v
	docker compose up -d --build

key:
	docker compose exec backend php artisan key:generate

migrate:
	docker compose exec backend php artisan migrate --force

seed:
	docker compose exec backend php artisan db:seed --force

tinker:
	docker compose exec backend php artisan tinker

routes:
	docker compose exec backend php artisan route:list

swagger:
	docker compose exec backend php artisan l5-swagger:generate

ps:
	docker compose ps
