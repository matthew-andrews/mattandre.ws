---
title: The case for object literals over self executing functions for modular javascript
date: 2012-12-15
categories:
- Technologies
- JavaScript
tags:
- HTML5
- Javascript
- Javascript Performance
- web app
---
(This was inspired by Objective-C, where methods of classes are [never *really* private](http://stackoverflow.com/questions/2158660/why-doesnt-objective-c-support-private-methods))

In the FT Web App and Economist HTML5 App we have been increasingly using self executing functions for non-instantiable modules as they are a good way to enforce private scope for variables and functions.

A totally realistic example of a module created through a self executing function could be:-

```js
var myObject = (function () {

	/**
	 * Private variable
	 *
	 * @private
	 */
	var _privateVariable;

	/**
	 * Public variable
	 *
	 * @public
	 */
	var publicVariable;

	/**
	 * Public setter method for private variable
	 *
	 * @public
	 */
	function setPrivateVariable(value) {
		_privateVariable = value;
	}

	/**
	 * Public getter method for private variable
	 *
	 * @public
	 */
	function getPrivateVariable(value) {
		return _privateVariable;
	}

	// Public api
	return {
		publicVariable: publicVariable,
		setPrivateVariable: setPrivateVariable,
		getPrivateVariable: getPrivateVariable
	}
}());
```

We have a compilation step to compile our code, which is capable of throwing a warning or even preventing compilation if we are using functions that we've marked as private through an appropriate JSDoc hint. Therefore, as long as we can guarantee private methods or variables are never accessed inappropriately we don't actually need to make private variables and methods private.

So the above example could, without changing any code that currently uses this object, easily be changed to something like this:-

```js
var myObject = {

	/**
	 * Enforce privateness if this property
	 * is detected to have been used outside
	 * of this module.
	 *
	 * @private
	 */
	_privateVariable: undefined,

	/**
	 * Public variable
	 *
	 * @public
	 */
	publicVariable: undefined,

	/**
	 * Public setter method for private variable
	 *
	 * @public
	 */
	setPrivateVariable: function setPrivateVariable(value) {
		var self = myObject;
		self._privateVariable = value;
	},

	/**
	 * Public getter method for private variable
	 *
	 * @public
	 */
	getPrivateVariable: function getPrivateVariable(value) {
		var self = myObject;
		return self._privateVariable;
	}
};
```
As a lot of our code (1mb of it in the FT Web App) currently needs to be evaluated at start up, I'm interested in knowing what is the extent of the performance benefit of using object literals over self executing functions (then rely purely on the compiler to catch any violation of private methods and variables of each module).

The results, [which show that object literals (the latter example) are 95% faster on certain platforms](http://jsperf.com/self-executing-vs-literal), could make shifting from enclosed modules to object literals worthwhile (assuming you have the infrastructure set up to stop other objects from accessing properties and methods they should not be able to).

The object literal approach also allows us to be able to write unit tests for private functions (one of the downsides of using the module pattern listed by [Addy Osmani's Javascript design patterns book](https://addyosmani.com/resources/essentialjsdesignpatterns/book/#modulepatternjavascript)).

**Update**: To my surprise, it turns out the results are reversed to some extent on Safari/iOS. So, as always, the right choice depends each project's individual requirements and supported platforms. But it seems moving to object literals isn't going to help the FT Web App achieve faster start times on its most popular platforms (iPhone, iPad).

**Update 2**: Sometimes the best solution is just to forget subtle micro-optimisations and instead focus on the developer joy. This is the equivalent code in CoffeeScript. Just lovely.

```coffee
class MyObject
	privateValue = undefined
	this.publicValue = undefined;
	this.setPrivateValue = (value) -> privateValue = value
	this.getPrivateValue = () -> privateValue;
```

Comments omitted because ~~I’m a bad person~~, ~~it’s five lines of code~~, they’re available above.
