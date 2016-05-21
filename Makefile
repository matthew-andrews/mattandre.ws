include n.Makefile

build build-production:
	rm -f public/feed
	hexo generate
	@$(MAKE) $@-super
	mv public/feed.xml public/feed

run:
	hexo serve -s

watch:
	@$(MAKE) watch-hexo watch-super -j2

watch-hexo:
	hexo generate --watch

test: verify
