---
title: Removing noise from Timeline reports in Chrome DevTools
date: 2013-11-10
categories: Work
---
[Timeline in Chrome's Dev Tools](https://developers.google.com/chrome-developer-tools/docs/timeline) is really cool. It can help you get all sorts of data from dozens of metrics on the performance health of your web application.

The problem is making Chrome Timeline recordings to me is a bit like the [Manual Burn scene in Apollo 13](http://www.metacafe.com/watch/an-bscBuY74YhbJmm/apollo_13_1995_a_manual_course_correction/). The minute you hit the red button and move your cursor back to the website all hell breaks loose.

It becomes a race against time to kill the recording before it has filled up with so much information, triggered by so many different events that you lose all hope of hunting down those janks, layout thrashes and performance burps.

No matter how hard I try my timeline recording never look consistent, with a (relatively) clear root cause like this:

[{% img /images/pauls.png %}](http://www.youtube.com/watch?v=z0_jD8nO5Zw)

– Chrome Office Hours: Performance

Unlike other profiling tools in Chrome that can be controlled directly from Javascript I always find my Timeline reports have really poor signal-to-noise ratios. They tend to be a chaotic mixture of colours and where there is good information, it can feel like I'm just being told that I'm doing **everything wrong**:

{% img /images/bad.png %}

Note how in the first few frames the frame rate budget is being burst by scripting, rendering **and** painting.

Where do you even start?

**I want a timeline that looks like this:**

{% img /images/neat.png %}

**Only** the events in the timeline are those I have triggered (which you can see beneath because I triggered them in **JavaScript**). There is nothing after, and nothing before – which means there is no need to waste time digging through looking for the event you're interested in.

**Tip: don't use your mouse when using Timeline profiling. Give elements IDs and trigger the events on them that you want to profile via the console.**

The result of doing this gives you a timeline that contains **only** the data that is relevant to the action you are profiling, [leading to easy investigate, reproducible test cases](https://github.com/ftlabs/ftscroller/issues/65):

{% img /images/test.png %}

This is an improvement but it doesn't work in all cases – some times you might want to profile, say, a hover state. I'd really like more granular control over what can start Timeline recording. Something like **Event Listener Breakpoints** (Sources panel of Dev Tools) to choose the sort of events that kick off Timeline recording (to be honest even just a way to stop mouse moves from doing it would be a good start)…

**Bonus tips – Keyboard Shortcuts**

Cmd/Ctrl + E starts and stops Timeline (and other profilers) recordings but the Dev Tools window must be focused so if you need to use the mouse during profiling (and want to avoid collecting too many extraneous mouse move events) you are probably going to want to switch back and forth with the keyboard.

Unfortunately there's no keyboard shortcut that I know of to directly switch between Dev Tools on the Timeline and the browser*. If you have Dev Tools undocked you can only use the native OS's window switching shortcuts (Alt + Tab on Windows, Cmd + ~ on Mac).

<small>\* In Chrome 30 if you switch on "Enable Cmd + 1-9 shortcut to switch panels" – the last option in the General tab of Dev Tools settings (click the cog) you can open the timeline with the easy to remember Cmd + Shift + J [release] Cmd + 5.</small>

If you have Dev Tools undocked you can use Cmd + Alt + J to show and hide Dev Tools (and switch what is the focused at the same time), but when Dev Tools closes any Timeline recording in progress will be killed :(.

**Pet Peeves**

Another really helpful feature Timeline has is when you hover over Layout events, it will show you the affected region by adding a semi transparent blue rectangle over the affected area on your web page.

If you accidentally hover over anything in the timeline report **whilst it's still recording** it'll still add blue highlighting to the elements affected – and that blue highlighting itself pollutes Timeline's output:

{% img /images/hmm.png %}

All the **Composite layers** events (the green ones) recorded after the ~8 second mark were caused by interacting with Timeline output.

When I'm profiling I'd rather Chrome didn't do any highlighting at all, but I feel it really, really shouldn't fill up the report produced Timeline with irrelevant noise that I then have to filter out…

### Bug reports

- [Don't add blue rectangles whilst profiling](https://code.google.com/p/chromium/issues/detail?id=317357)
- [Start profiling from Chrome, not (only) devtools](https://code.google.com/p/chromium/issues/detail?id=317358)
- [More control over the first event collected by the Timeline profiler.](https://code.google.com/p/chromium/issues/detail?id=317359)

---

### Update: you can now start and stop timeline profiles from JavaScript

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">DevTools tip: Start/stop Timeline recordings directly from your code with console.timeline() &amp; console.timelineEnd() <a href="http://t.co/QxbPgK0WTc">pic.twitter.com/QxbPgK0WTc</a></p>&mdash; Addy Osmani (@addyosmani) <a href="https://twitter.com/addyosmani/status/487353570606743552">July 10, 2014</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>
