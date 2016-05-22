---
title: Playing with Channel messaging
date: 2014-05-18
categories: Work
---
Whilst building some [recent](https://matthew-andrews.github.io/serviceworker-simple) [experiments](https://matthew-andrews.github.io/serviceworker-chat) with ServiceWorkers I've discovered a whole new API that I never knew existed: **Channel messaging**. Paper-clipped onto the end of the HTML5 Web Messaging specification, Channel messaging enables:

> …independent pieces of code (e.g. running in different browsing contexts) to communicate directly
> http://www.w3.org/TR/webmessaging/#channel-messaging

As far as I can see, they're basically Javascript wormholes between different tabs and windows.

# How do they work?

te a new channel you call the `MessageChannel` constructor in the normal way:

```js
var wormhole = new MessageChannel();
```

The wormhole has two portals, which are `wormhole.port1` and `wormhole.port2` and to send objects between one and the other you can `postMessage` the data on the sending port and listen to `message` message events on the receiving port.

One small complexity is that you won't be able to listen to any of the incoming messages until `start` has been called on the *receiving* port.

*Note: any data sent before the port has been opened will be lost – and there's no way to interrogate the `MessageChannel` to find out whether a port is open or not.*

*Also note: as `postMessage` is asynchronous you can actually swap the `wormhole.port2.start()` and `wormhole.port1.postMessage('HELLO');` around and it will still work.*

```js
var wormhole = new MessageChannel();
wormhole.port2.addEventListener('message', function(event) {
	console.log('port2 received:'+event.data);
});
wormhole.port2.start();
wormhole.port1.postMessage('HELLO');
```

[See this for yourself on JSBin](http://jsbin.com/natom/1/edit?js,console)

## It's no fun to talk to yourself

Let's now see if we can use a Shared Worker to wire two browser windows up with each other and see what we are able to send, window to window, tab to tab. The [full code is up on GitHub](https://github.com/matthew-andrews/messagechannel-demo/) and you can [try it out there](https://matthew-andrews.github.io/messagechannel-demo).

For this we'll need two files: `index.html` and `agent.js`.

### `/agent.js`

```js
var mc;
onconnect = function(e) {
	var port = e.ports[0];
	if (mc) {
		port.postMessage({ port: mc.port2 }, [m c.port2 ]);
		mc = undefined;
	} else {
		mc = new MessageChannel();
		port.postMessage({ port: mc.port1 }, [ mc.port1 ]);
	}
};
```

This is the `SharedWorker`. Every odd browser window that connects to it (ie. the 1st, 3rd, 5th, etc), it creates a new `MessageChannel` and passes one of the ports of that MessageChannel object to that browser window. It will also keep hold of a reference to the most recently created `MessageChannel` so that it can give the other port of it to the ‘even’ connecting browser windows (the 2nd, 3rd, 4th, …).

This allows the `SharedWorker` to hook up the browser windows, after which it can simply get out of the way – allowing the browser windows to talk to each other directly.

### `/index.html`

```html
<!DOCTYPE HTML>
<title>MessageChannel Demo</title>
<pre id="log">Log:</pre>
<script>
	var worker = new SharedWorker('agent.js');
	var log = document.getElementById('log');
	worker.port.onmessage = function(e) {
		window.portal = e.data.port;
		window.portal.start();
		window.portal.addEventListener('message', function(e) {
			log.innerText += '\n'+ (typeof e.data) + ' : ' + e.data;
		});
	}
</script>
<button onclick="window.portal.postMessage('hi');">Send 'hi'</button>
<button onclick="var now = new Date();window.portal.postMessage(now);">Send a date object</button>
<button onclick="var node = document.createElement('div');window.portal.postMessage(node);">Send a dom node</button>
```

This code will connect to the `SharedWorker`, wait for the `SharedWorker` to send it one of the ports of the `MessageChannel` (which the `SharedWorker` will create) and when it gets one, it will start listening to **message** events and print out the data it receives onto the web page.

I've also added some buttons so that it's easy to test sending bits of data between the two browser windows. (Remember, you need to have two browser windows open for this to work)

## Uncaught DataCloneError: Failed to execute ‘postMessage’ on ‘MessagePort’: An object could not be cloned.

Not every kind of javascript object can be sent in this way (which is why DOM nodes fail). According to the specification:

> Posts a message to the given window. Messages can be structured objects, e.g. nested objects and arrays, can contain JavaScript values (strings, numbers, Dates, etc), and can contain certain data objects such as File Blob, FileList, and ArrayBuffer objects.
> http://www.w3.org/TR/2012/WD-webmessaging-20120313/#posting-messages
