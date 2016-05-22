---
title: Full Frontal Conference 2013 Notes
tags:
- brighton
- conferences
- HTML
- HTML5
- Javascript
- Sass
categories:
- Work
- Conferences
date: 2013-11-09
---
### 09:50 — 10:30: [ES6 Uncensored (slides)](https://speakerdeck.com/anguscroll/es6-uncensored) *[Angus Croll – @angustweets](https://twitter.com/angustweets)*

A whistlestop tour of ES6 (the upcoming version of javascript due next year). The highlight for me was finally an explanation of `yield` that I actually understood. *Is it me or does ES6 look a lot like Scala?*

- [Traceur](http://traceur-compiler.googlecode.com/git/demo/repl.html) [(github)](https://github.com/google/traceur-compiler) – try out ES6 online in a JSBin-y sort of way
- [Orde Saunders' notes on Angus' talk](http://decadecity.net/blog/2013/11/08/angus-croll-es6-uncensored)

---

### 10:30 – 11:10: [Javascript in the real world (slides)](https://speakerdeck.com/andrew/javascript-in-the-real-world) *[Andrew Nesbitt – @teabass](https://twitter.com/teabass)*

Mind still buzzing with `yield`ing generators we segued into Andrew Nesbitt's delightful Terminator-reference and Rabbit-photo packed presentation on the cutting edge of Javascript powered robots.

- [Control your Lego Mindstorms EV3 Tanks with an xbox controller over bluetooth](https://github.com/andrew/node-ev3-robot)
- [Johnny Five](https://github.com/rwaldron/johnny-five) – the jQuery of the javascript robots world.

---

### 11:40 – 12:20: [Mobile isn't a thing, it is everything (slides)](http://www.slideshare.net/joemccann/mobile-is-not-a-thing-it-is-everything) *[Joe McCann – @joemccann](https://twitter.com/joemccann)*

Lots of charts of absurd growth and examples of mobile changing everything, from the most frivolous to the most life-saving and inspirational ways.

- [Kinsa](https://www.kinsahealth.com/) – the $1 thermometer and app for your smartphone – was my key wow moment from Joe's talk
- [Uber kitten delivery service](http://blog.uber.com/ICanHasUberKITTENS)

---

### 12:20 – 13:00: [Pushing the limits of mobile performance (slides)](https://docs.google.com/presentation/d/1onNCD7APXOwbG58hvXdlogLDXbpId-KDeOLqr8xJ79Y/pub?start=false&loop=false&delayms=3000#slide=id.p) *[Andrew Grieve – @GrieveAndrew](https://twitter.com/GrieveAndrew)*

A peak into the history of Gmail web app for the original iPhones. Amazing to see how much faster smart phones have become since 2007. My main take away: Javascript performance isn't the issue it used to be on mobile devices – rendering is (probably) a much bigger concern.

- [Eliminate the 360ms delay on touch screen devices but be aware of the caveats](https://github.com/ftlabs/fastclick)
- [Use the HTML5 AppCache, but read Jake Archibald's post first](http://alistapart.com/article/application-cache-is-a-douchebag)
- Genius tip: send XHR requests on app start before the code to handle the response has run. Assign the response to a global variable and retrieve later.

---

<p align="center">*[break for fish ‘n’ chips](http://www.bardsleys-fishandchips.co.uk/)*</p>

---

### 14:30 – 15:10: [Our web development workflow is completely broken (slides)](http://auchenberg.github.io/presentations/fullfrontal-our-web-development-workflow-is-completely-broken/#1) *[Kenneth Auchenberg – @auchenberg](https://twitter.com/auchenberg)*

I imagine like many I had unquestioningly accepted the fact that when I use Chrome I must use Chrome dev tools; for Safari and iOS I must use Safari’s and so on.
We’ve all been doing it wrong.

- [The humbly titled “Initiative to unify remote debugging across browsers”](http://remotedebug.org/)

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Chrome devtools bridged to Firefox. Just WOW. Thanks <a href="https://twitter.com/remotedebug">@remotedebug</a>! <a href="https://twitter.com/hashtag/fullfrontalconf?src=hash">#fullfrontalconf</a> <a href="http://t.co/2bCbnGwApL">pic.twitter.com/2bCbnGwApL</a></p>&mdash; Thomas Parisot (@oncletom) <a href="https://twitter.com/oncletom/status/398827159709839360">November 8, 2013</a></blockquote>

---

### 15:10 – 15:50: [Stunning visuals with maths and… No javascript? (slides)](http://f773873.5minfork.com/) *[Ana Tudor – @thebabydino](https://twitter.com/thebabydino)*

Really, really cool demonstrations of what can be done with just CSS (and maths).

- [Maths-powered transforms for creating 3D shapes](http://www.youtube.com/watch?v=w9HeWBH_kvg)
- [Ana’s CodePen account is amazing](http://codepen.io/thebabydino)

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">“If we put it all together, we get really simple code.” <a href="https://twitter.com/thebabydino">@thebabydino</a>, cool as a cucumber <a href="https://twitter.com/hashtag/fullfrontalconf?src=hash">#fullfrontalconf</a> <a href="http://t.co/YkG89djsdW">pic.twitter.com/YkG89djsdW</a></p>&mdash; Benjen Darlow (@kapowaz) <a href="https://twitter.com/kapowaz/status/398836328399654913">November 8, 2013</a></blockquote>

---

### 16:20 – 17:00: [Building with web components using x-tags (slides)](http://afabbro.github.io/jsconfcolombia-2013-mobile-apps-with-brick/) *[Angelina Fabbro – @angelinamagnum](https://twitter.com/angelinamagnum)*

The cutting edge of Web Components from the Mozilla camp.

- [Web components explainer](https://dvcs.w3.org/hg/webcomponents/raw-file/ccd579693e46/explainer/index.html)
- [Mozilla App Maker](http://appmaker.mozillalabs.com/)
- [Ohai from Meatspaces](https://chat.meatspac.es/)

---

### 17:00 – 17:40: [Time (slides)](https://speakerdeck.com/adactio/time) *[Jeremy Keith – @adactio](https://twitter.com/adactio)*

And Full Frontal 2013 ended on *Time* – an exploration of the permanence of digital information, the longevity of formats and a brief history of time.

- [“The original URL for this prediction (www.longbets.org/601) will no longer be available in eleven years.”](http://longbets.org/601/)
- [Swiss Fort Knoxx](http://www.swissfortknox.com/) – “forget the Cloud, I want my data stored in a mountain”
- [Ruth Belville, the "Greenwich Mean Time Lady"](http://en.wikipedia.org/wiki/Ruth_Belville)
- [The “Powers of 10” video](http://www.youtube.com/watch?v=0fKBhvDjuy0)

---

What an excellent day at the seaside.
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>
