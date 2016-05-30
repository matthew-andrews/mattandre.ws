---
title: A well-behaved JavaScript component
date: 2013-05-08
categories:
- Work
- JavaScript
tags:
- CSS
- JavaScript
- object orientated design
- offline
- web app
---
I've recently been involved in integrating a large and complex JavaScript application into another large and complex JavaScript application and this has led me to think about potential best practises for JavaScript components.

Based on this experience I have a compiled a list of basic rules for a component to follow.

## A well behaved component…

### Should not speak unless it is spoken to.

A well behaved component should be an instantiable object that exposes an API, which will enable the parent application to completely control that single instance of that component.

Unless instructed to by the parent application, the component should never search through, read from or write to the DOM.

When the component wants to inform the parent application of an event prefer to do so via the observer pattern. One very light, NPM/bower installable event library is Wilson Page's [event](https://github.com/wilsonpage/event).

Until it has been instantiated the component should do nothing. The component should also do nothing when its JavaScript is first executed.

### Cleans up after itself.

To [avoid detached DOM nodes](http://stackoverflow.com/questions/11930050/finding-js-memory-leak-in-chrome-dev-tools), it should leave no event listener bound to any DOM element (even if that DOM element has gone).

### Is not an individual.

It should be able to cope with being instantiated multiple times. It, and none of its sub-components (or sub-sub-components, etc) should be singletons.

### Asks politely for the things it needs (or brings them itself).

For example if the component is dependent on a JavaScript library it can either explicitly request that library be made available to it to use, or it should have that library built into the component's compiled JavaScript at build-time.

Similarly if the component is dependent on some CSS, it should expose a route to that CSS (either as pure text or a via URL) and the parent application should be responsible injecting or importing those style rules.

For example, it should never write script tags directly into the DOM in order to load in sub dependencies – loading JavaScript from the network should be the sole responsibility of the parent application. The reason for this is if the application is an offline application that resource might not always be available if it's pointing to an external URL. By informing the parent application upfront about your dependency the parent application can make sure that JavaScript is available no matter what the state the device's internet connection is in.

### Should not get upset when it's no longer wanted.

It should expect that it can be destroyed at any time. All callbacks to asynchronous logic should handle the case where the objects or DOM nodes that they were just talking to no longer exist.
