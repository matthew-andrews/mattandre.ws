---
title: Open all files with uncommitted git changes in separate vim tabs
date: 2013-08-17
categories:
- Technologies
- Vim
tags:
- bash_profile
- vi
- vim tips
---
Another quick tip. Open all files with uncommitted changes in separate vim tabs:

```sh
vi -p `git status --porcelain | cut -c4-
```

You can add it as an alias alias vi-git-status to your .bash_profile:

```sh
alias vi-git-status='vi -p `git status --porcelain | cut -c4-`'
```
