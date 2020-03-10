build build-production:
	rm -rf public
	npm run build-hexo
	npm run build-webpack

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
	cd public && aws s3 sync --cache-control 's-maxage=31536000, max-age=300' --size-only --delete . s3://mattandre.ws
