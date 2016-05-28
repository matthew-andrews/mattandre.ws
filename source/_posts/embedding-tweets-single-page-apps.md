---
title: Beware of embedding tweets in full screen single page apps
tags:
- HTML
- HTML5
- offline
- web app
categories:
- Technologies
- JavaScript
date: 2014-05-10
---
Using components built by other people is fundamental to the success of any piece of technology. The more high quality physical and virtual components you can pull together, the less you need to build from scratch and the faster you can build things. We've been sharing and reusing code since the beginning of the web – and almost every web company that I can think of offers some way to embed their content on your site.

That's all fine until you find the component does something that you don't expect it to. For example, if the creator of the component made an assumption that is not true for your application, instead of saving you time it can cause problems for your application or the component itself. This happened to us when we tried to embed Tweets in the FT Web App.

## This is an embedded Tweet:

This is an embedded Tweet:

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Want to know how to make your web page/app work offline or survive a crappy connection? <a href="http://t.co/jQl6G1TiO2">http://t.co/jQl6G1TiO2</a> with <a href="https://twitter.com/andrewsmatt">@andrewsmatt</a></p>&mdash; Jim Cresswell (@JimCresswell) <a href="https://twitter.com/JimCresswell/status/464336250447867904">May 8, 2014</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

One of the features the JavaScript Twitter use for embedded tweets on external websites has is that if you click **reply** or **retweet** instead of taking your user away from your website to Twitter, it will helpfully open a new, smaller window in which the user can use to post Tweets from, like this:

{% img /images/tweet-window.png %}

The problem is that the way this is implemented is that it doesn't just affect the behaviour for links within the `<blockquote class="twitter-tweet">` elements, it will listen to clicks on **all** links **anywhere** anywhere on your web page – and if the link is to a URL containing `twitter.com/intent` it will open a small new window.

To see this behaviour [click here](https://twitter.com/intent/tweet).

Interestingly it'll also match links to others domains, as long as they contain the pattern `twitter.com/intent/`. Eg. http://mattandre.ws/twitter.com/intent/tweet. [Play around with this on JSBin](http://jsbin.com/huxok/2/edit?html,js,output).

After a bit of digging, hidden in the minified code Twitter encourage you to use, are these few lines that are responsible for this:-

```js
function m(e) {
	var t, r, i, s;
	e = e || window.event, t = e.target || e.srcElement;
	if (e.altKey || e.metaKey || e.shiftKey) return;
	while (t) {
		if (~n.indexOf(["A", "AREA"], t.nodeName))
			break;
		t = t.parentNode
	}
	t && t.href && (r = t.href.match(o), r && (s = v(t.href), s = s.replace(/^http[:]/, "https:"), s = s.replace(/^\/\//, "https://"), g(s, t), e.returnValue = !1, e.preventDefault && e.preventDefault()))
}

[...]

var o = /twitter\.com(\:\d{2,4})?\/intent\/(\w+)/, u = "scrollbars=yes,resizable=yes,toolbar=no,location=yes", a = 550, f = 520, l = screen.height, c = screen.width, h;
b.prototype = new t, n.aug(b.prototype, {render: function(e) {
	return h = this, window.__twitterIntentHandler || (document.addEventListener ? document.addEventListener("click", m, !1) : document.attachEvent && document.attachEvent("onclick", m), window.__twitterIntentHandler = !0), s.fulfill(document.body)
}}), b.open = g, e(b)
```

For most ordinary websites this behaviour wouldn't be surprising – and probably even desired.

But our site ain't no ordinary website. It's one of those modern new fangled offline-first single page apps called [the FT Web app](http://app.ft.com).

Most of our users use our application full screen after it has been added to their (typically) iOS home screen. The problem is that we need to be in complete control (within javascript) of what happens when the user clicks any link because the default behaviour is fairly ugly (the application will suddenly close and the link will be opened in Safari). In order to make that experience a little less awful, in order to support external links like we first show the user a popup warning them that they're about to leave the app like this:-

{% img /images/are-you-sure-you-wanna-exit.png %}

I'd be the first to admit that this isn't exactly the pinnacle of user experience – it reminds me of the Microsoft Office paperclip helpfully double checking that you're absolutely “sure you wanna exit?” but it's the best we can do for now.

When we tried to start using Twitter's embedded Tweet functionality we found that the code we'd carefully crafted to stop web links from inadvertently closing our full screen web app was being completely bypassed. In the end decided not to use Twitter's javascript library.

It's a little bit unfair that I've singled out Twitter, especially as they do provide [the raw CSS to style Tweets](https://dev.twitter.com/docs/tfw/embed-code-css) without the JavaScript that does all the weird stuff. In fact we've ended up shunning lots of different libraries for similar reasons (eg. jQuery and numerous advertising libraries) and every now and again one of our advertisers creates an advert that breaks critical features of our web application, which never fails to create a little excitement in the office. For being so adverse to externally written code, we've gained something of a reputation internally.

The fundamental problem is that unless you use an iframe to embed content (like YouTube does) – which causes numerous other problems for our web app so we don't support either :( – the web is not encapsulated. If you add a 3rd party library to your web page, that library can do what it wants to your page and, short of just removing it, there isn't always much you can do about it if it does do something you don't agree with.

### Guidance

If you're building websites in non-standard ways (full screen ‘web apps’; packaged/hybrid apps; single page apps and/or offline first apps) don't automatically assume that because you're using ‘web technologies’ you will be able to use every existing library that was built for the web. All libraries – even modern, well written ones like the one Twitter use for embedding Tweets – are built with certain assumptions that may not be true for your product.

In the future [Web components (via Shadow DOM)](http://html5-demos.appspot.com/static/webcomponents/index.html#25) will finally bring the encapsulation that the web needs that will help us address some of these problems.

Hopefully iOS will also make the way it handles links in full screen web apps a little better too.
