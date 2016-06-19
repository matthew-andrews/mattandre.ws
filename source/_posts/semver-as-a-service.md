---
title: Semver as a Service
date: 2016-06-18
categories:
- Technologies
- AWS
tags:
- Lambda
- Golang
---

I've been continuing learning bits and pieces with mini projects…  This time: **Semver as a Service** built with AWS Lambda, AWS API Gateway, [AWS CloudFormation](https://github.com/matthew-andrews/semver-as-a-service/blob/master/templates/stack.json) and Golang.

## What is ‘Semver as a Service’?

https://github.com/matthew-andrews/semver-as-a-service/

**Semver as a Service** is a simple API that will look at any GitHub repository's releases/tags, sort them and tell you the highest version or, if you specify a constraint, the highest version that meets a constraint.

Try it out here:-

- [/semver/github/financial-times/n-makefile](https://api.mattandre.ws/semver/github/financial-times/n-makefile)
- [/semver/github/financial-times/n-makefile/^1.0.0](https://api.mattandre.ws/semver/github/financial-times/n-makefile/%5E1.0.0)
- [/semver/github/financial-times/n-makefile/~1.0.0](https://api.mattandre.ws/semver/github/financial-times/n-makefile/~1.0.0)

## Why?

Well, the main purpose was to learn Go, AWS, etc, but it's also handy for writing install scripts.  For example, this could be a simple script to install the latest version of [s3up](https://github.com/matthew-andrews/s3up) on your Mac:-

```
curl -sf https://api.mattandre.ws/semver/github/matthew-andrews/s3up \
	| xargs -I '{}' curl -sfL https://github.com/matthew-andrews/s3up/releases/download/{}/s3up_darwin_386 -o /usr/local/bin/s3up \
	&& chmod +x /usr/local/bin/s3up
```
