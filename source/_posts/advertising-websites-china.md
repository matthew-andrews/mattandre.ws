---
title: How Chinese ISPs put adverts on your website
date: 2012-10-04
categories: Work
tags: China
---
{% img /images/ads.png %}

So Chinese ISPs silently wrap your website in an iframe, then float an advert in the bottom corner over your content.

**This causes a number of Javascript errors and warnings…**

{% img /images/errors.png %}

20+ cross domain security warnings… Yet another reason to use a modern browser…

After spending hours measuring performance almost line by line to ensure the web apps I contribute to are optimised for speed (not including this site, which is a just-add-water WordPress installation), having it dumped inside an iframe and forced to run along some shoddily written and non-minified Javascript libraries is a little disheartening.

This is way more advanced than merely blocking an URL. I wonder how else they are able to read, rewrite and manipulate web content…

Serving the website over SSL stops the adverts from appearing.
