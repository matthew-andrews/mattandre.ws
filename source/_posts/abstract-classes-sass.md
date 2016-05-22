---
title: Abstract class in Sass / Scss via the placeholder selector
date: 2012-11-15
categories:
- Technologies
- Sass
tags:
- Abstract
- Sass
---
Super useful snippet that is going to literally save us **bytes** of useless CSS from our web apps.

Sass / Scss supports abstract selectors – which are removed from the compiled CSS but can be `@extend`'ed.

Here's some SCSS:-

```scss
%abstract-class {
	font-family: Verdana;
}

#my-div {
	@extend %abstract-class;
}

#my-other-div {
	@extend %abstract-class;
}
```

Which will be compiled as:-

```scss
#my-div, #my-other-div {
	font-family: Verdana;
}
```
