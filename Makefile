lint-frontend:
	make -C frontend lint

install:
	npm ci

start-frontend:
	make -C frontend build && make -C frontend start

start-backend:
	npx start-server -p 5001 -s ./frontend/build

deploy:
	git push heroku main

start:
	make start-backend && make start-frontend 