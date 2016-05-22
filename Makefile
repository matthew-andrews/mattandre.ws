include n.Makefile

build build-production:
	rm -rf public
	hexo generate
	@$(MAKE) $@-super

run:
	static public

watch:
	@$(MAKE) watch-super watch-hexo -j2

watch-hexo:
	hexo generate --watch

test: verify

deploy:
	nht deploy-static `find . -path "./public/*"` --strip 1 --region eu-west-1 --cache-control 300 --bucket mattandre.ws
