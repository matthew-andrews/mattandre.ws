---
title: DOM Event Delegation without jQuery
date: 2014-08-02
categories:
- Work
- JavaScript
tags:
- FT
- JavaScript
- web app
- jQuery
- HTML5
---
When building the [FT's](https://app.ft.com/) and [Economist's](https://app.economist.com/) HTML5 apps we felt that as we were targeting only the latest browsers shipping the entirety of jQuery would be a bit – well – wasteful. What we wanted were small focused components that could be swapped in and out that we could pull in (initially) via **npm**, **bower** or (later) our [build service](https://origami-build.ft.com/). This thinking has since spread to the rest of the FT, who are now also [moving away from jQuery](http://origami.ft.com/docs/3rd-party-a-list/#why-not-jquery).

## So what *is* jQuery?

According the documentation, it's quite a lot of things – as a very crude measure, [its API docs have 593 articles](http://api.jquery.com/). I don't think I'm unusual in thinking that the vast majority of that I've never used and probably would never use.

For me what has made jQuery so helpful are its wrappers that make Ajax, DOM manipulation, DOM transversal and listening to events simple to do.

Since the ‘invention’ of jQuery the browser has completely changed. Whilst we sometimes need to maintain backwards compatibility, for example [our stubborn friends in China who just refuse to let go of IE6](https://developer.microsoft.com/en-us/microsoft-edge/ie6countdown/), the browser now provides a huge amount of what jQuery gave us natively. (Specifically I'm thinking of things like `querySelectorAll`, `classList`, the new array methods)

Also after using TJ Holowaychuk's [SuperAgent](https://github.com/visionmedia/superagent) I can't look at jQuery's Ajax API without seeing its idiosyncrasies. (Why is `type` not `method`!?)

## What to do about event delegation?

But there was a piece of jQuery we needed that was missing in the component world and that is a *nice* library to help with event delegation [(read more about Javascript event delegation and why you might use this pattern on Site Point)](https://www.sitepoint.com/javascript-event-delegation-is-easier-than-you-think/). So we built one and called it [FT DOM Delegate](https://github.com/ftlabs/ftdomdelegate) (or `dom-delegate` on the npm or bower registries).

Without the baggage of an old API that everyone already knows we were able to start from scratch. So this is what we did:-

## You decide which DOM element to listen to events on

```js
var bodyListener = new Delegate(document.body);
var targetedListener = new Delegate(document.getElementById('my-el'));
```

Rather than listening to all events on the same place (usually `document.body`) FT DOM Delegate allows you to create more focused DOM Delegates that only listen to events within a specific element. This is really helpful for creating self-contained widgets or in single page applications like our's where we dynamically load pages without refreshing the page (where each page might require a different set of event listeners).

## Delegates can be killed

```
targetedListener.destroy();
```

Just one call to `destroy` and all events will be unbound, event listeners removed. On single page apps with views being rapidly created and destroyed – this is essential to prevent memory leaks.

We actually went a step further to make delegates **recyclable**. Via the delegate's `root` method you can trivially attach and detach delegates to DOM nodes. This is useful as it allows you to completely re-render the pages' HTML in javascript without having to re-attach all the event listeners individually.

```html
<body>
	<section id="pane-1">
		<button>Click me</button>
	</section>
	<section id="pane-2">
		<button>No, Click me</button>
	</section>
</body>
```

```js
var pane1 = document.getElementById('pane-1');
var pane2 = document.getElementById('pane-1');

var dd = new Delegate();
dd.on('click', 'button', function() {
	console.log("button clicked");
});

dd.root(pane1);
// Clicking 'Click me' => console.log
// Clicking 'No, click me' => nothing

dd.root(pane2);
// Clicking 'Click me' => nothing
// Clicking 'No, click me' => console.log
```

## Delegates can be created without the DOM

Because Delegates can be detached from the DOM we realised that we didn't actually need any DOM at all to be able to set up event listeners.

You can set up a delegate's event listeners whenever you like, and when you are ready to actually start receiving those events, simply attach the delegate:-

```js
var dd = new Delegate();
dd.on('click', '.close', function() {
	closeOverlay();
});

// ** some time later **
var overlay = document.getElementById('overlay');
dd.root(overlay);
```

## Use capture for pros

nother area we felt was missing from other event libraries was that whilst they were extremely helpful in basic cases – because of the need to support legacy IE they didn't give you access to decide whether you wanted your event listeners to be capturing or not. (For more detail on how DOM events and `useCapture` work [read my former colleague Wilson Page's article on Smashing Mag)](https://www.smashingmagazine.com/2013/11/12/an-introduction-to-dom-events/).

Basically all events start at the document body then step through the DOM until they hit the element where the event (for example a click) was triggered. Then, if the event can bubble, it reverses back through the DOM until it hits the document body again. (Not all events bubble – for example `error` and `blur` events)

As the event moves from the document body towards the target element it is said to be in its **capturing phase**, when it reaches the target it is **at target** and is in its **bubbling phase** when it reverses back up through the document.

Sometimes when you are adding listeners you will want to specify which stage of the event flow you are interested in. Our DOM Delegate library allows you to do this via its fourth parameter:-

```js
delegate.on('click', '.js-btn', function() {
	console.log("Caught event during capturing phase!");
}, true);
delegate.on('click', '.js-btn', function() {
	console.log("Caught event during bubbling phase!");
}, false);
```

## Sensible defaults for capture phases

Some events don't bubble – e.g. `error`, `blur`, `focus`, `scroll`, and `resize` – so for these (unless you specify otherwise) we set `useCapture` to be `true` by default.

This is handy as we like to handle all image load failures by hiding them, which we can do with just a few lines of code:-

```js
var dd = new Delegate(document.body);
dd.on('error', 'img', function() {
	this.style.display = 'none';
});
```

## Events for the future

With this library we believe we've made a really nice and absolutely tiny event delegation library that gives you as much power as the browser native methods – with some helpful methods that allow to you to easily tidy up after yourself. And we're one step closer to kicking our jQuery addiction.

And, of course, it's open source: https://github.com/ftlabs/ftdomdelegate.
