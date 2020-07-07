---
title: Building a half-a-second website
date: 2016-05-28
categories:
- Technologies
tags:
- HTTP2
- Website Performance
- Lambda
---
I've spent the past couple of weekends rebuilding my website.  Previously it was a really old, slow, out-of-date WordPress site running on ridiculously expensive (for what it was) GoDaddy shared hosting.  Converting it to a statically generated (Jekyll or similar) site had been on my to-do list for years…

This is it.

## Tools and architecture

- It's built with **[Hexo.io](https://hexo.io/)** (although I swapped out the Sass compilation with [one we developed for the Financial Times](https://github.com/Financial-Times/n-makefile) and removed the client side JavaScript entirely.
- It's hosted on S3 (provisioned with [CloudFormation](https://github.com/matthew-andrews/mattandre.ws/blob/master/templates/stack.json)).
- Circle CI runs the builds and pushes to production on green (when linting passes and the pages build).
- It's behind a CDN (CloudFlare) who provide SSL for free (thank you CloudFlare <3).  They also support HTTP2 and have a nice API that you can use to do some clever cache optimisations with…

## Purge on deploy

Currently the CDN in front of https://mattandre.ws is configured to store everything for up to **1 month** (and I'm talking to CloudFlare to see if I can increase this to a year) but only instruct users' browsers to only cache pages for up to 30 minutes.  Then, I have set things up to call the [CloudFlare API](https://api.cloudflare.com/#zone-purge-individual-files-by-url-and-cache-tags) to automatically purge the files that have changed — and only the files that have changed.

Now clearly since Circle CI is already running all my build steps for me and knows what files have changed it could easily coordinate purging of the CDN.  Indeed, we use this pattern a lot at the FT.  But that was nowhere near over-engineered enough to qualify for a weekend hack project.

Instead, I created a Lambda function that was connected to my website's S3 bucket's `ObjectRemoved` and `ObjectCreated` streams.  Each change in the S3 bucket generates an event that then triggers a Lambda function (written in Go) that purges the CDN for the associated pages.  [See the code.](https://github.com/matthew-andrews/mattandre.ws-websitecdnpurge/blob/master/functions/purge/main.go)

Making this change caused the cache hit ratio to jump and even though the website was already fast before making this change, it's now even faster still.  Pages no longer need to travel all the way from Ireland (where my S3 bucket is) to reach every user — it would be as if the site had servers in every one of [these cities around the world](https://www.cloudflare.com/network-map/).

## HTTP2 + S3 + CDN make a very fast website

When you add together HTTP2, S3 and smart use of a CDN you get a very performant website.

{% img /images/crazyperformance.png %}

The above image shows that, occasionally, pages take the almost same amount of time to load in production (right) as they do _on my local machine_ (left).  Production isn't always this quick (a few, very unscientific and statistically invalid spot checks of pages on https://mattandre.ws shows that most of the site loads in about half a second, but is sometimes as slow as 800ms) but it does show that a crazy level of performance _is possible_.

And there's so much more left to optimise.
