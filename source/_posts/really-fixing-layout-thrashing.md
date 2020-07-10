---
title: Fixing Layout thrashing in the real world
date: 2014-05-17
categories:
- Technologies
---
This is sort of a rehash of [Wilson Page’s ‘Preventing Layout Thrashing’](http://blog.wilsonpage.co.uk/preventing-layout-thrashing/) but I wanted to look at the topic with a practical example from the FT Web app. Much credit goes to him, Jamie Blair and Ada Edwards for their work creating, and then taming, [FastDOM](http://github.com/wilsonpage/fastdom).

> Layout Thrashing occurs when JavaScript violently writes, then reads, from the DOM, multiple times causing document reflows.
> http://wilsonpage.co.uk/preventing-layout-thrashing/

Often talks on the subject of Layout Thrashing will start with a simple code sample that causes layout thrashing – and show how a developer might rework it to prevent it. Here’s one originally from [one of Andrew Betts’s presentations](http://triblondon.github.io/talk-html5perf/#/32):-

```js
var h1 = element1.clientHeight;           // Read (measures the element)
element1.style.height = (h1 * 2) + 'px';  // Write (invalidates current layout)
var h2 = element2.clientHeight;           // Read (measure again, so must trigger layout)
element2.style.height = (h1 * 2) + 'px';  // Write (invalidates current layout)
var h3 = element3.clientHeight;           // Read (measure again, so must trigger layout)
element3.style.height = (h3 * 2) + 'px';  // Write (invalidates current layout)
etc.
```

Then there’ll be an example of how you might fix it:-

```js
var h1 = element1.clientHeight;           // Read
var h2 = element2.clientHeight;           // Read
var h3 = element3.clientHeight;           // Read
element1.style.height = (h1 * 2) + 'px';  // Write (invalidates current layout)
element2.style.height = (h1 * 2) + 'px';  // Write (layout already invalidated)
element3.style.height = (h3 * 2) + 'px';  // Write (layout already invalidated)
etc.
```

Often though many presenters (myself included) will stop there and leave the pesky implementation details up to the developer to sort out.

The problem is nobody actually codes like this.

This is a screenshot from the project that I work on, the [FT Web app](https://app.ft.com):

{% img /images/webapp-1024x710.png %}

When we can use CSS (which is immune to layout thrashing) to layout our pages we do but sometimes it’s not possible to do *everything* we need to in CSS. To give an example of the layout thrashing challenges we have within the web app I’ve highlighted three of the components that each require a little bit of javascript.

### Component 1

It’s quite hard to see on the screenshot but we are required to add an ellipsis (…) when the text – which is displayed in two columns – overflows the component (look closely at the bottom right corner). Currently, multi-line ellipsis across multiple columns where the number of lines displayed is dynamic, dependent on the amount of space available, is not possible in CSS. Because of this we created the open source library, [FT Ellipsis](http://github.com/ftlabs/ftellipsis).

For ellipsis to work it is first required to **measure** the size of the container, and the number of lines contained within it; and then it has to **write** the ellipsis styling / insert any additional helper elements into the DOM.

### Component 2

The amount of space allocated to component 2 is equal to the height of the window minus the header above it and the advert beneath it – this is done in CSS. However we want to be able to vary the *number of lines shown per item*. The more space available, the more lines shown – and this is not currently possible in CSS.

To achieve this layout we must first **measure** the amount of space there is available and then **write** the appropriate styles into the DOM to clip the text at the point where the component is not able to comfortably show any more text.

### Component 3

Finally component 3 is a scrollable column. We would *love* to do this with pure CSS however the scrolling support for sub-elements on a page on touch devices is currently quite poor and so we must use a momentum scrolling library instead – we use [FT Scroller](https://github.com/ftlabs/ftscroller) but another popular open source scrolling library is [iScroll](https://github.com/cubiq/iscroll).

In order to set up a scroller we must first **measure** the amount of space is available and then **add** some new layers and apply some new classes on elements on the page.
### But we’ve used components! How could we be possibly causing layout thrashing?

Because we want to keep each component completely independent from every other, we store each component’s Javascript in a separate file. Taking the first component as an example, its implementation would look a bit like this:-

```js
[...]
 
// Javascript to run when the component
// has been inserted into the page
insertedCallback: function() {
  this.ellipsis = new FTEllipsis(this._root);
 
  // Calculate the space available and figure out
  // where to apply the ellipsis (reads only)
  this.ellipsis.calc();
 
  // Actually apply the ellipsis styling/actually
  // insert ellipsis helper `div`s into the page.
  // (writes only)
  this.ellipsis.set();
}
 
[...]
```

At first glance this seems sensible and their own each component will be as performant as it can be.

### Except when we bring the three components together

Because each `setupCallback` first does a bit of reading followed by a bit of writing, as the browser iterates through and runs them we will inadvertently cause ourselves Layout Thrashing – even though there is no code where it seems we have interleaved DOM reads and DOM writes.

So we created [FastDOM](https://github.com/wilsonpage/fastdom).

```js
[...]
 
// Javascript to run when the component
// has been inserted into the page
insertedCallback: function() {
  this.ellipsis = new FTEllipsis(this._root);
 
  FastDOM.read(function() {
 
    // Calculate the space available and figure out
    // where to apply the ellipsis (reads only)
    this.ellipsis.calc();
 
    FastDOM.write(function() {
 
      // Actually apply the ellipsis styling/actually
      // insert ellipsis helper `div`s into the page.
      // (writes only)
      this.ellipsis.set();
    }, this);
  }, this);
}
 
[...]
```

So now when the ‘`setupCallback`’s are run for each of the components, we don’t touch the DOM *at all*. Instead, we tell FastDOM that we want to do a bit of reading and then a bit of writing – and then allow FastDOM to sensibly order those operations. This eliminated Layout Thrashing.

### Except that we had caused ourselves a thousand other problems instead

As the FT Web app is a single page app we are constantly loading and unloading pages, bringing new content and layouts into view – only to destroy them shortly after. In some circumstances the lifetime of any one of those pages can be very short. Sometimes even shorter than the lifetime of a `requestAnimationFrame` timeout.

And when that happened there would be nothing to unschedule the work we had deferred and, even though the DOM element already no longer existed, those FastDOM callbacks would try to do the work that had been assigned to them. Chrome Dev Tools console was *full* of errors.

We could have simply added a check at the beginning of every FastDOM callback to see if the element still existed but that would have to have been added in hundreds of places – and would probably be forgotten often. We needed to find a proper solution.

### FastDOMs for everybody

In order for FastDOM to be effective there can only be one of them active on a page – it needs to be in overall control of all the DOM reads and writes in order to schedule them all at appropriate times. However, the downside of having a single queue for reads and writes is that it is very difficult to unschedule all the work scheduled by a single component.

What we needed was a way for each component to maintain its own queue of FastDOM work – whilst still leaving scheduling and processing of work to the single app-wide FastDOM.

So we created [Instantiable FastDOM](https://github.com/orangemug/instantiable-fastdom).

### Instantiable FastDOM

The name is actually a little confusing because Instantiable FastDOMs aren’t really FastDOMs at all – they’re queues of work that has been scheduled in FastDOM ([we’re thinking about changing this](https://github.com/orangemug/instantiable-fastdom/issues/8)).

They are intended to be used by components so that components can easily clear any outstanding FastDOM work when they are destroyed.

So here is the code sample above rewritten with *Instantiable* FastDOM:

```js
[...]
 
// Javascript to run when the component
// has been inserted into the page
insertedCallback: function() {
  this.ifd = new InstantiableFastDOM();
  this.ellipsis = new FTEllipsis(this._root);
 
  this.ifd.read(function() {
 
    // Calculate the space available and figure out
    // where to apply the ellipsis (reads only)
    this.ellipsis.calc();
 
    this.ifd.write(function() {
 
      // Actually apply the ellipsis styling/actually
      // insert ellipsis helper `div`s into the page.
      // (writes only)
      this.ellipsis.set();
    }, this);
  }, this);
},
removedCallback: function() {
 
  // Clear any pending work
  this.ifd.clear();
}
[...]
```

### We have a winner

At long last we had a solution that:

- eliminated layout thrashing;
- didn’t cause hard javascript errors for its edge cases;
- and didn’t add too much additional complexity to the implementations of each of our components.

### What about 3rd parties?

No matter how performant and well written your application is, all that hard work can be completely undone by the potentially-not-as-well-informed developers of the widget you’ve been forced to embed on your application.

As usual there’s no magic answer – except that to hope that authors of Javascript libraries which interact with the DOM will split their instantiation logic up so that **DOM reads** and **DOM writes** can be run separately and users of those libraries can (if they want to) schedule those pieces of work in a sensible order.

Our ellipsis library, FTEllipsis, is our first example of an open source library that provides this flexibility by separating its instantiation logic into: `calc` (which only does DOM reads) and `set` (which only does DOM writes).

### Layout Thrashing isn’t going away

As [web components](https://css-tricks.com/modular-future-web-components/) get ever closer and websites start to be built that adhere to their principles, if we don’t start using tools like FastDOM, those components are going to merrily read and write to the DOM without pausing to consider what other components might be doing – and Layout Thrashing is going to become harder and harder to avoid.
