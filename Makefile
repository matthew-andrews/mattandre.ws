include n.Makefile

build-production:
	rm -f public/feed
	hexo generate
	# HACK
	mv public/feed.xml public/feed


run:
	hexo serve

test: verify
