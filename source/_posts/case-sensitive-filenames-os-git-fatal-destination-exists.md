---
title: "Case sensitive filenames on OS X with git – “fatal: destination exists”"
date: 2013-06-27
categories:
- Technologies
- Git
---
One of the more frustrating features of OS X when you're using git that can really trip you up if you're frequently switching between Linux and OS X is that **file names on OS X are [not case sensitive](http://stackoverflow.com/questions/10523849/changing-capitalization-of-filenames-in-git)**. It doesn't understand the difference between blah and Blah.

This is fine if you always keep those files on you Mac, but usually at some point you're going to want to move those to another machine. Sometimes that machine will be Linux based (it could be a webserver, for example) and you might like use git to share those files between those machines. At that point if a file's name has the wrong case, scripts on the new machine will not be able to find those files anymore…

Also on OS X by default git won't let you just rename a file to the same name with different case – it'll warn you with a fatal error that the “destination exists”.

Luckily the solution is simple (the hard part is realising it's the case that's wrong).

To rename a file with git on OS X to the same name (but with in a different case) just add `--force`.

So renaming `src/ws/mattandre/classname.java` to `src/ws/mattandre/ClassName.java` would require the following command:

```sh
git mv --force src/ws/mattandre/classname.java src/ws/mattandre/ClassName.java
```
