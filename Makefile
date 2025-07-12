build:
	npm install
	npm run build

docker-build:
	docker-compose build

up:
	docker-compose up -d

start: build docker-build up

logs:
	docker-compose logs -f app

down:
	docker-compose down

down-rmi:
	docker-compose down --rmi all
