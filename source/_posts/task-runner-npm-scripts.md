---
title: Yet another task runner
date: 2014-08-30
tags:
- broccoli
- duo
- grunt
- gulp
- make
- phing
- task-runner
categories:
- Work
- JavaScript
---
Now you've all heard of **[Grunt](http://gruntjs.com/)**, **[Gulp](http://gulpjs.com/)**, **[Broccoli](https://github.com/joliss/broccoli)** and **[Duo](http://duojs.org/)** I think it's time for me to announce a task runner for JavaScript projects that I've been *ahem* working on*. It's called **scripts**.

## Adding tasks

Tasks are simply added to your project's `package.json` like this:

```json
[..]
	"scripts": {
		"test": "npm run jshint && npm run lintspaces && mocha",
		"jshint": "jshint *.js",
		"lintspaces": "lintspaces -ntd spaces -i js-comments -s 2 *.js"
	},
[..]
```

## Running tasks

Simply type `npm run <scriptname>` into your Terminal. For the most commonly run script, `test`, you can even just type: `npm test`.

## Pass information from task to task

By using the back-tick \` and `npm run`'s silent mode you can even pass information from task to task:

```json
[..]
	"scripts": {
		"test": "npm run jshint && npm run lintspaces && mocha",
		"jshint": "jshint `npm run -s js-files`",
		"lintspaces": "lintspaces -ntd spaces -i js-comments -s 2 `npm run -s js-files`",
		"js-files": "find . -name '*.js' ! -path './node_modules/*'"
	},
[..]
```

Here I am using `npm run -s js-files` to get a list of all the JavaScript files in my project, which are then being linted by Lintspaces and JSHint via `npm run jshint` and `npm run lintspaces`.

## Plugins

It comes with support for **[JSHint](http://jshint.com/)**, **[Browserify](https://github.com/substack/node-browserify)**, and more – in fact because it works any tool that has a command line interface directly it supports everything! And you can say goodbye to installing `foo-contrib-bar`.

## Shut up, Matt

If you haven't guessed by now this post is intentionally a little bit tongue-in-cheek and provocative – but it is also a serious suggestion and I'm [not the first person to suggest it](http://substack.net/task_automation_with_npm_run).

Using `npm scripts` as your task runner has a number of quite compelling advantages:

- If you have node, **npm scripts is already installed**.
- With npm scripts you will have fewer dependencies because you install tools directly rather than the task-runner specific version of each tool, which makes them **quicker to install and easier to update**.
- **Reduces the number of files** in your repositories (no need for an additional Gruntfile, Gulpfile, etc)

One obvious downside is that for complex projects the scripts section of your `package.json` files will start to get a little crowded. But for those cases there's a natural upgrade path to [make](http://mrbook.org/tutorials/make/)…

{% img /images/trollface.png [[Thank you and good night]] %}

\* This might be a lie.
