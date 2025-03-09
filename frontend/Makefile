start:
	npm start

install:
	npm ci

publish:
	npm publish --access=public

# TODO: добавить линтеры и тесты
lint:
	npx eslint . --config ./.eslintrc.yml

test:
	echo no tests

install-deps:
	sudo npm install --unsafe-perm
	sudo npm update
	sudo npm audit fix