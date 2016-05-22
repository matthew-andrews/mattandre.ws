include n.Makefile

build build-production:
	rm -rf public
	hexo generate
	@$(MAKE) $@-super
	mv public/feed.xml public/feed

run:
	static public

watch:
	@$(MAKE) watch-super watch-hexo -j2

watch-hexo:
	hexo generate --watch

test: verify
