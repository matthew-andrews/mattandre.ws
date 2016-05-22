---
title: Writing npm modules in ES6 that run in ES5
date: 2015-07-23
categories:
- Work
- JavaScript
tags:
- ES6
- JavaScript
---
“*Writing* ES6 is lovely, but *using* it is a nightmare,” a colleague of mine remarked today.

Actually, he used a swear word.

The problem is we're far from being ready to assume that every app or module that depends on our npm modules is capable of understanding ES6. If we want to be able to write our modules in ES6 we must transform them.

## What should and should not be committed into source control

- Only the original source files should be committed into repositories.
- Never commit anything that is automatically built or compiled by a tool or script.
- Never commit css that has been built from Sass.
- Or javascript that has been transpiled by babel.

## Why?

- It's confusing for developers coming to the project fresh. It's often not clear which files they should edit.
- Built files *always* drift out of sync with source files because someone *always* forgets to rebuild before committing.
- It makes using GitHub's web UI to make changes impractical or often impossible.
- It messes up diffs and commit history.
- Just never commit built files*.

\* O.K. so this is like any other rule—break it before doing something even worse—but except on those occasions, definitely never do it!

## Writing npm modules in ES6 so that they run in ES5

There are some convenient hooks in npm scripts where you can integrate any build steps for npm modules. One of them is `prepublish` that will, as the name suggests, run before npm pushes your module to the registry.

The following snippet in your `package.json` will convert all the files in src from ES6 to ES5 and pop the result a new folder called `build`:

```json
"main": "build/main.js",
"scripts": {
	"prepublish": "babel src --out-dir build"
}
```

Additionally, you can create an `.npmignore` file with `src/` in it to prevent the original pre-transpiled ES6 code from being published to the npm registry.

## Side effects

This has annoying consequences. Run `git status` after an `npm publish` and you'll notice that, as expected, the built files have been generated—and git will tempt you to commit them.

As I've hopefully convinced you, committing built files is a Bad Idea™. Instead, you might consider adding `/build/` to your `.gitignore` file.

This will solve the immediate issue of stopping you accidentally committing your built files into git but will create another issue.

`npm publish` will exclude all files matching the rules in `.gitignore` from being published to the registry. If you added `/build/` to your project's `.gitignore` the built JavaScript won't be published and apps and modules depending on your component will break.

To fix this simply create a `.npmignore` file — its mere existence will prevent npm looking at our .gitignore file and our code will be properly published to the npm registry.

> Use a .npmignore file to keep stuff out of your package. If there's no .npmignore file, but there is a .gitignore file, then npm will ignore the stuff matched by the .gitignore file. If you want to include something that is excluded by your .gitignore file, you can create an empty .npmignore file to override it. — https://docs.npmjs.com/misc/developers

For our project we'll probably want an .npmignore file that looks like this:-

```
src/
```

## Side Effects, round 2

The npm command line tool will allow you to install dependencies from the registry — the normal way—or directly from git.

For example if you run `npm install --save strongloop/express` it will bypass the npm registry and go straight to GitHub to download express from there.

Because we've pointed the main property of the package.json of our module to a file that doesn't exist in git and therefore doesn't exist when our module is installed this way *it will not work*.

The fix? Commit the built files.
