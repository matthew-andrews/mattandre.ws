---
title: Uploading static files & websites to Amazon S3 efficiently with s3up
date: 2016-06-11
categories:
- Technologies
- AWS
tags:
- CLI
- S3
- static website
---

I've been using [Amazon S3](https://aws.amazon.com/s3) at work and at home a lot recently and have grown to really like its features.  Versioning, lifecycle rules and event streams can be used in really cool ways to make rock solid and {% post_link half-a-second-website super performant%} websites.

When it comes to actually uploading files to S3 there are plenty of choices for command line tools but they all seemed to a bit more than I wanted or not quite enough and I'm learning Go at the moment so…

## Introducing s3up!

https://github.com/matthew-andrews/s3up

A new cross platform command line tool for uploading files to S3.

If you'd like to try it out or report bugs, [installation instructions and more information is up on GitHub](https://github.com/matthew-andrews/s3up).

### Features

- Optimised for uploading **static websites**
- Uploads multiple files **concurrently** (or can be set to upload one at a time — this can be controlled via the `--concurrency` option)
- Only uploads files that are **new** or have **changed**
- Automatically detects and sets an appropriate `Content-Type` for each file uploaded
- Allows for easy configuration of ACLs and `Cache-Control` headers for files
- Splits large files up and uploads them in smaller pieces
- Written in Go and compiled for all platforms, which means it is **fast**, can be **installed quickly**, and is **standalone** — it does not rely on other dependencies (like Python or Node)
- Allows manipulation of the path that files get uploaded to 
- Has a `--dry-run` so that the changes it will make to objects in S3 can be previewed

### Manipulating upload path

When deploying a static website to S3 it's useful to be able to upload files *from* a different local directory than the one you're working in or *to* a directory other than the root in the S3 bucket.

With s3up, files can be uploaded into subdirectories via the `--prefix` option and leading components to be stripped off file names (for example a generated `index.html` in a `dist` folder can be uploaded to the root of an S3 bucket like this: `s3up --strip 1 dist/index.html --bucket s3up-test`)

I hope you like it and find it useful.  Please [report bugs](https://github.com/matthew-andrews/s3up/issues) if you find them.
