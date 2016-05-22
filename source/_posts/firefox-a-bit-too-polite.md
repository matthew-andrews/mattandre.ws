---
title: Firefox asks for offline permission, twice
date: 2012-09-06
tags:
- appcache
- FT
- HTML5
- web app
categories:
- Work
- FTLabs
---
If you follow [my tutorials](http://labs.ft.com/category/tutorial/) on the FT Labs website on how to make an offline web app, FT style, and try loading the app in Firefox (15) the following menus will appear:-

{% img /images/firefox.png %}

That's right, Firefox will ask you for permission to store data for offline use, **twice**.

> This web site (dev.labs.ft.com) is asking to store data on your computer for offline use – [Allow] [Never for This Site] [Not Now]

The first is for permission to use the application cache and the second is for permission to open an indexedDB. However the end user isn't able to tell which menu refers to which requested permission (the wording and menu options are *identical*) and worse both menus look as if they were designed by completely different teams.

Even more worse, unless both permissions are granted to the website it will not be able to work properly offline. So if the user allows only one of them they might think that it should work offline (because Firefox told them so), but it won't – at least not for this app.

To be fair on Firefox, all the browsers are guilty of confusing and inconsistent permissions requests for client side databases. But Firefox, weren't you supposed to be the cool one?

Personally I think asking for permission to store a web app offline is a step forward (on other platforms permission is only required if you exceed the initial quota for the local database, which can be around 5MB to 25MB – and no permission is required for the use of an application cache) – it allows web apps to better service the needs of drive-by users who may just visit your website once from a link (that they may have seen on Twitter or Weibo and don't want to have anything stored offline) and the needs of users who want to be able to take your entire website on the plane, videos ‘n’ all. Also it helps educate and inform users that the website they are on is capable of being used offline – important as that many users are still not aware that the technology exists to allow websites work offline.

However I believe they should be asked once – potentially with a menu similar to Facebook's or Google Play's app installation process where the permissions requested by the app are given up front in one place.

## More generally

This stuff is important because I believe the trend toward walled-gardens that the addiction to native apps is encouraging is bad for consumers and the future of the industry as a whole. [Things are getting better](http://labs.ft.com/2012/08/fixing-app-cache/) but right now making web apps that can compete with native apps is being made unnecessarily hard by the [application cache's douchebaggery](http://www.alistapart.com/articles/application-cache-is-a-douchebag/) and the labyrinth of well-meant but [innovation stifling browser limitations](http://labs.ft.com/2012/06/text-re-encoding-for-optimising-storage-capacity-in-the-browser/) that leave developers confused and users lost.
