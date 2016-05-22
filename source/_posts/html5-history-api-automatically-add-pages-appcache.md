---
title: Does the HTML5 History API automatically add pages to the AppCache?
date: 2013-07-12
categories:
- Technologies
- HTML5
tags:
- appcache
- HTML5
- web app
---
I met with a colleague from a previous company this evening who had gotten back in touch after stumbling across [one of the tutorials I had written about the HTML5 History API and AppCache](http://labs.ft.com/2013/04/offline-html5-history-api/). This, I thought, was quite cool. What was less cool was that my post didn't actually answer his question, which was:

> Do pages visited via the HTML5 History API get automatically added to the Application Cache?

The answer: No, they don't.

Basically, the AppCache can only store the URLs that are either:

1. Listed in the AppCache manifest for the page that was originally loaded from the network.
1. Or, are themselves the page that is loaded from the network. (See this wonderfully titled Stack Overflow post: [“My HTML5 Application Cache is caching everything”](http://stackoverflow.com/questions/9287044/my-html5-application-cache-manifest-is-caching-everything))

Note to self – what happens if you programmatically change the manifest attribute on the html tag? (Or set it if it was blank before?). The answer: absolutely nothing.
