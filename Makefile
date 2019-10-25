include n.Makefile

build build-production:
	rm -rf public
	hexo generate
	@$(MAKE) $@-super

run:
	npm start

watch:
	@$(MAKE) watch-super watch-hexo -j2

watch-hexo:
	hexo generate --watch

test:
	npm test

deploy:
	cd public && aws s3 sync --cache-control 's-maxage=31536000, max-age=300' . s3://mattandre.ws
#	find . -path "./public/*" -exec s3up --strip 1 --cache-control 's-maxage=31536000, max-age=300' --bucket mattandre.ws {} +
