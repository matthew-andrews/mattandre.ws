---
title: How to write a hash in YAML
date: 2020-05-15
categories:
- Technologies
---
I was tripped up by this silly little thing whilst writing a blog post with the title [**Week Notes #1 - Copying, Listening, Running, Emergency**](/2020/05/week-notes-1/), which rendered as **Week Notes**.

My code was:

```yaml
title: Week Notes #1 - Copying, Listening, Running, Emergency
```

YAML had, as my blog's syntax highlighting hints, interpretted everything from the # (hash or pound) symbol onwards as a **comment**.

The fix is simple. **Put the #-containing content in quotes**:

```yaml
title: 'Week Notes #1 - Copying, Listening, Running, Emergency'
```
