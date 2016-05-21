---
title: "Haikro: better Heroku deploys for Node.js"
date: 2014-11-23
categories: Work
---
There's a lot to love about Heroku. Servers spin up instantly. Code deployments are quick. You can rollback to any old version of your application in just one click.

And much, much more.

**But there's a lot I don't like about Heroku for Node.js web applications**

By default it runs npm install to install dependencies as part of every deploy. Although it has some magic to cache those dependencies and the NPM registry is a lot more reliable than it used it be this still introduces some risk that if npm install **can't run, you won't be able to deploy your app**.

Also as our websites have gotten more complex, to keep our codebases tidy we've started using tools like SASS and Browserify to split our CSS and front-end JavaScript up across multiple files. This means that it's quite normal for applications that I work on to need to be ‘built' before they can be published on the web. If you're using Heroku and need to run a lot of built steps as part of your deploy the options are even worse than for node_modules. You either need to remember to rebuild and commit the files that get generated into git before deploying — or run your **entire build process on Heroku itself**.

Running your build process on Heroku turns out to be quite difficult. Often build processes rely on a lot of tools — SASS, for example, relies on Ruby. If you run your build process on Heroku you'll end up installing a lot of tools onto your web server that will only ever get used once, when the site is deployed. This slows down your deploy and makes it more fragile.

It is true that if you check your node_modules and, if you have them, build JavaScript and CSS files into git Heroku won't need do all these steps on deploy but I prefer not to do that because doing this ruins ‘diffs’ previews between commits and means that you can't make quick edits to code via the GitHub UI — need to run the whole build process for every change.

## Introducing Haikro

Heroku actually supports two mechanisms for deploying code. You can either use Heroku toolbelt and (typically) typing `git push heroku` or they [now also have a new API that can be used for deployments](https://devcenter.heroku.com/articles/platform-api-deploying-slugs).

Unfortunately that new API is **very** sensitive to the format of the applications you give it to run. Because of this I've written a small wrapper around that API that can be dropped into any Node.js project which means that the code that is deployed onto Heroku no longer needs to be the same code that is checked into git. I've called it **[Haikro](https://github.com/matthew-andrews/haikro)**.

```sh
./node_modules/.bin/haikro build deploy \
	--app my-heroku-app \
	--heroku-token $(HEROKU_AUTH_TOKEN) \
	--commit `git rev-parse HEAD` \
	--verbose
```

I've tried my best not to reinvent too much and so pretty much everything about how you write Node.js apps for deploying via git push heroku should work for Haikro too, for example:-

### Specific version of Node.js

To specify a particular version of Node.js add an ‘engines.node' property to your package.json file with the semver of your desired Node.js version:-

```json
[…]
	"engines": {
		"node": "0.10.x"
	}
[…]
```

### Procfile

Also Procfiles for web nodes will continue to work (but not yet for worker nodes):-

```
web: node server/app.js
```

### Bringing this together

This means you can pre-download your dependencies and run your build steps locally or as part of your Continuous Integration process (I've tested [Codeship](https://codeship.com/), [Travis](https://travis-ci.org/) and [CircleCI](https://circleci.com)) and then all Heroku needs to do is run your application.

[Continue to a full worked example using Grunt, SASS and Express…](https://github.com/matthew-andrews/haikro-sass-app/)

[Or, take a look at the Haikro repository.](https://github.com/matthew-andrews/haikro/)
