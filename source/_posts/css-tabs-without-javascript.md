---
title: "Snippet: CSS Tabs without Javascript or Hashtag URLs"
date: 2012-08-29
categories:
- Work
- FTLabs
tags:
- CSS3
- HTML
---
Lately [in the lab](http://labs.ft.com/) we’ve been experimenting with using `<form>` elements to shift the burden handling basic functionality from Javascript to CSS and HTML to keep our apps as responsive and our Javascript code as clean as possible, especially whilst the Javascript engine (which, of course, [with few exceptions](https://github.com/matthew-andrews/Overtime) is only able to do one thing at a time) is busy processing.

[Check out the result.](http://codepen.io/WilsonPage/full/fxwni)

Here’s the CSS that does the heavy lifting:-

```css
input:nth-child(1):checked ~ .tabs li:nth-child(1) label,
input:nth-child(2):checked ~ .tabs li:nth-child(2) label,
input:nth-child(3):checked ~ .tabs li:nth-child(3) label,
input:nth-child(4):checked ~ .tabs li:nth-child(4) label {
  /* Put the CSS to show the tab button is active here */
}

input:nth-child(1):checked ~ .sections li:nth-child(1),
input:nth-child(2):checked ~ .sections li:nth-child(2),
input:nth-child(3):checked ~ .sections li:nth-child(3),
input:nth-child(4):checked ~ .sections li:nth-child(4) {
  /* Put the CSS to show the tab content is active here */
}
```

For the following HTML markup:-

```html
<input type="radio" id="s1" name="s" checked />
<input type="radio" id="s2" name="s" />
<input type="radio" id="s3" name="s" />
<input type="radio" id="s4" name="s" />
<ul class="tabs">
  <li><label for="s1">One</label></li>
  <li><label for="s2">Two</label></li>
  <li><label for="s3">Three</label></li>
  <li><label for="s4">Four</label></li>
</ul>
<ul class="sections">
  <li>Section one</li>
  <li>Section two</li>
  <li>Section three</li>
  <li>Section four</li>
</ul>
```

If you don’t mind using hash tag URLs a [potentially better alternative is on CSS Tricks](http://css-tricks.com/css3-tabs/).
