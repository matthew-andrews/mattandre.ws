build build-production:
	npm run build

run:
	npm start

watch:
	@$(MAKE) watch-hexo watch-webpack -j2

watch-hexo:
	npm run watch-hexo

watch-webpack:
	npm run watch-webpack

test:
	npm test

deploy:
	cd public && aws s3 sync --cache-control 's-maxage=31536000, max-age=300' --size-only . s3://mattandre.ws
