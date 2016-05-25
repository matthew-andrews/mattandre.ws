---
title: Make for hipsters
date: 2016-05-25
categories:
- Technologies
- Make
tags:
- task-runner
---
## Introduction

Most tools fall into one of two types.  Tools that are nice to use and tools that are ubiquitous.  Make is the second type.  Initially released in 1977, it has stubbornly refused to go away for four decades.

For our front end projects at the FT we built an incredibly powerful suite of [gulp-based build tools](https://github.com/Financial-Times/origami-build-tools) (and then wrapped them in an even more [feature-rich set of build tools](https://github.com/Financial-Times/next-build-tools/)).  But, with an ever increasingly large dependency tree, they started to take more and more minutes to install.  That was fine when we were making use of all their features, but often when we were building little prototypes or simple APIs we didn’t really need Sass or Gulp but ended up depending on it away because it was all bundled together.

When we started migrating some parts of our apps to AWS Lambda, which for the types of functions we were building, has no front end, forcing developers to install and use these gulp based tools on every build seemed crazy.

I took another look at `make` and these are the notes from what I learnt.

Warning: these notes are probably **factually inaccurate**, almost certainly promote **bad practise**, and are definitely **delightfully hacky**.  Enjoy.

## Make for beginners

### Getting started

`make` is a command line tool.  If you create an empty new directory and run it, you’ll get an error like:-

```
$ make
make: *** No targets specified and no makefile found.  Stop.
```

You need to create a `makefile` to tell `make` what to do.

#### Advanced: What should I call my `makefile`?

By default, `make` will try the following filenames in the following order: `GNUmakefile`, `makefile` and `Makefile` but your makefile can have any filename you like.

If you’ve called it a name other than one of the defaults, you need to tell make that filename, which you can do by providing the `-f` option.

```
$ make -f MyMakefile
```

Make's documentation recommends `Makefile` as the filename.

### Rules

The fundamental feature of build automation tools like Make is to allow developers to define tasks.  In makefile these are called **rules**.

A simple `makefile` rule looks like:-

```
target … : prerequisites …
[hard tab] recipe
```

An example of a makefile with a single, very basic rule could be:-

```
dothings:
	echo "hello world"
```

In this case we have a single ‘target’, `dothings`, and a single line ‘recipe’, `echo "hello world"`.  The recipe simply prints out the text ‘hello world’ into the terminal.

Try this by runing that rule by typing `make dothing` into your terminal.  It should output someting like:-

```
$ make dothings
echo "hello world"
hello world
```

To do more than one task, one at a time, just like out the tasks using spaces to separate them.

For example, for this make file:-

```
dothis:
	echo "this"

dothat:
	echo "that"

dotheother:
	echo "theother"
```

Leads to this…

```
$ make dothis dothat dotheother
echo "this"
this
echo "that"
that
echo "the other"
the other
```

#### Advanced: only outputting the output

Make has done a little more than we've asked it too.  In addition to running the ‘recipe’ for `dothings`, it has also output the recipe itself.

If you want to stop make from doing this either add an `@` to the beginning of the line in the makefile, or use the `-s` option when you run `make` on the command line.

```
dothings:
	@echo "hello world"
```

Or

```
$ make -s dothings
hello world
```

### Doing two things at once

By default Make runs one task a time.  You can allow make to do more than one thing at a time through the `-j` or `--jobs` option.  So `make dothis dothat dotheother -j2` will run two ‘jobs’ at a time, `make dothis dothat dotheother -j` will not limit the number of things it does at once.

## Intermediate make

### Writing the perfect install script

We use [npm](http://npmjs.com) to manage dependencies for our NodeJS applications but the these notes apply to most other package managers (e.g. bower, composer, maven, etc).

#### npm explained in 30 seconds:-

- When you run `npm install`, npm will download your project's dependencies into a folder called `node_modules`  (equivalent to bower's `bower_components` or composer's `vendor` directories)
- npm dependencies are listed in a `package.json` file, typically stored in the root of the repositories (equivalent to maven's `pom.xml` or ruby's `Gemfile`)

We wanted to have a single rule that you could run on within any of our repositories that would install each repository's dependencies.  The first version looked a bit like this:-

```
install:
	npm install
```

That worked and is simple except that if you ran `make install` twice in quick succession the second time, although faster than the first, would be quite slow.

One feature of make is that it checks if a file or folder matching the rule name exists first before executing that rule's recipe â€” and it won't run the recipe if that file or foler already exists.

So we can improve our `make install` rule by:-

- adding a new makefile rule called `node_modules`,
- making `node_modules` a ‘prerequisite’ of `install`,
- and moving `npm install` to be run in the `node_modules` rule.

```
install: node_modules

node_modules:
	npm install
```

This is great because once you have successfully installed all the repository's dependencies if you run `make install` into your terminal make will instantly tell that there is `Nothing to be done for 'install'`.

Unfortunately this has introduced a problem.  If you add a new dependency, for example, to your `package.json` file, `make install` will fail to run `npm install` and that new dependency will not be installed.

I actually lied to you earlier.

When I said that ‘one of the features of make was that it checks if a file or folder matching the rule name exists first before executing that rule's recipe â€” and won't run the recipe if that file or folder already exists’ I was oversimplifying things.

If that task's name matches a file and that that has prerequisites that match files that exist, make will look the last modification date of those files with the files.  If those files have changed more recently than the files that match the task name, it will run the recipe.

That's quite difficult to understand so if you don't get it, follow the example and hopefuly it will be a little clearer…

Our makefile will now look like this:-

```
install: node_modules

node_modules: package.json
	npm install
```

Create a `package.json` file containing:-

```
{
	"dependencies": {
		"inherits": "^2.0.1"
	}
}
```

Then run `make install`:-

```
$ make install
npm install
inherits@2.0.1 node_modules/inherits
```

(Note: I've removed some npm warning that aren't important for this discussion)

Then run `make install` again:-

```
$ make install
make: Nothing to be done for `install'.
```

Then edit `package.json` and change it to:-

```
{
	"dependencies": {
		"inherits": "^2.0.1",
		"path-is-absolute": "^1.0.0"
	}
}
```

Now run `make install` again and you'll see that `npm install` runs again:-

```
$ make install
npm install
path-is-absolute@1.0.0 node_modules/path-is-absolute
```

(Note: I've removed some npm warning that aren't important for this discussion)

I now have to admit this whole section is a lie.

A perfect install script isn't possible as it's not smart enough to know to only run `npm install` if something about the `dependencies` within the `package.json` file changes.

But still, it's pretty good.

### Using the `makefile` language

#### What you need to know

- You can write simple programs with the **makefile language**.
- A typical `makefile` will contain a **mixture** of the **makefile language** and **bash**.
- A single line can contain **both** the makefile language as well as bash.
- bash can **only** be written in the **recipe** section of rules.
- You can write the makefile language **anywhere** within a `makefile`.
- Every line of bash is isolated from every other.
- The parts of the makefile written in makefile are executed **once** when the `makefile` is compiled.

#### Basic functions

A function call looks like this:-

```
$(function argument,argument,…)
```
(You can use either normal `()` brackets or curly `{}` brackets)

A very simple (and not very useful) example of a function is `subst`, which does a find and replace of text in a string.

```
$(subst from,to,text)
```

For example:

```
secure:
	echo "$(subst http,https,http://mattandre.ws)"
```

```
$ make secure
echo "https://mattandre.ws"
https://mattandre.ws
```

Note: you might be tempted to add some whitespace to make things look a bit neater, for example:-

```
secure-with-space:
	echo "$(subst http, https, http://mattandre.ws)"
```

Don't do this.  That whitespace matters to make and will try to replace the string `http` with the string ` https` (rather than the expected `https`) in the string ` http://mattandre.ws` (rather than the expected `http://mattandre.ws`).  Sometimes this doesn't matter but often it will.  It's best to **not** include any whitespace between arguments in Make function calls.

In the above example results in **two* additional and probably unwanted spaces being added to the beginning of the domain name.

```
$ make secure-with-space
echo "  https://mattandre.ws"
  https://mattandre.ws
```

You can read more about make functions in the manual or see some creative uses of them in the [Financial Times' shared front end application Makefile](http://www.gnu.org/software/make/manual/make.html#Syntax-of-Functions).
